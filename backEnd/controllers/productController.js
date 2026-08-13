const pool = require("../database");

async function getProducts(req, res) {
  try {
    const {
      search = "",
      category = "",
      minPrice = "",
      maxPrice = "",
      inStock = "",
      sort = "name-asc",
      page = "1",
      limit = "8",
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit, 10) || 8, 1),
      50
    );
    const offset = (pageNumber - 1) * limitNumber;

    const whereClauses = [];
    const values = [];

    if (search.trim()) {
      values.push(`%${search.trim()}%`);

      whereClauses.push(
        `(p.product_name ILIKE $${values.length}
          OR p.description ILIKE $${values.length})`
      );
    }

    if (category) {
      values.push(category);

      whereClauses.push(
        `(c.categoryID = $${values.length}
          OR c.category_name ILIKE $${values.length})`
      );
    }

    if (minPrice !== "") {
      const parsedMinPrice = Number(minPrice);

      if (Number.isNaN(parsedMinPrice) || parsedMinPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "minPrice must be a non-negative number.",
        });
      }

      values.push(parsedMinPrice);
      whereClauses.push(`p.price >= $${values.length}`);
    }

    if (maxPrice !== "") {
      const parsedMaxPrice = Number(maxPrice);

      if (Number.isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "maxPrice must be a non-negative number.",
        });
      }

      values.push(parsedMaxPrice);
      whereClauses.push(`p.price <= $${values.length}`);
    }

    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice.",
      });
    }

    if (inStock === "true") {
      whereClauses.push("p.inventory_quantity > 0");
    }

    const sortOptions = {
      "price-asc": "p.price ASC",
      "price-desc": "p.price DESC",
      "name-asc": "p.product_name ASC",
      "name-desc": "p.product_name DESC",
    };

    const orderBy = sortOptions[sort] || sortOptions["name-asc"];

    const whereSql =
      whereClauses.length > 0
        ? `WHERE ${whereClauses.join(" AND ")}`
        : "";

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM products p
      JOIN categories c
        ON p.category = c.categoryID
      ${whereSql};
    `;

    const countResult = await pool.query(countQuery, values);
    const total = countResult.rows[0].total;

    const dataValues = [...values];

    dataValues.push(limitNumber);
    const limitPlaceholder = `$${dataValues.length}`;

    dataValues.push(offset);
    const offsetPlaceholder = `$${dataValues.length}`;

    const productsQuery = `
      SELECT
        p.productID,
        p.product_name,
        p.description,
        p.price,
        p.image_url,
        p.inventory_quantity,
        c.categoryID,
        c.category_name
      FROM products p
      JOIN categories c
        ON p.category = c.categoryID
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder};
    `;

    const productsResult = await pool.query(
      productsQuery,
      dataValues
    );

    const totalPages =
      total === 0 ? 0 : Math.ceil(total / limitNumber);

    return res.status(200).json({
      success: true,
      count: productsResult.rows.length,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      products: productsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
}

module.exports = {
  getProducts,
};