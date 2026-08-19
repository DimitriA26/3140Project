const pool = require("../config/database");

const SORT_OPTIONS = {
  "price-asc": "p.price ASC",
  "price-desc": "p.price DESC",
  "name-asc": "p.name ASC",
  "name-desc": "p.name DESC",
};

// GET /api/products
async function getAllProducts(req, res, next) {
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
    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 8, 1), 50);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClauses = [];
    const values = [];

    if (search.trim()) {
      values.push(`%${search.trim()}%`);
      whereClauses.push(
        `(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length})`
      );
    }

    if (category) {
      values.push(category);
      whereClauses.push(
        `(c.id::text = $${values.length} OR c.name ILIKE $${values.length})`
      );
    }

    if (minPrice !== "") {
      const parsedMinPrice = Number(minPrice);
      if (Number.isNaN(parsedMinPrice) || parsedMinPrice < 0) {
        return res.status(400).json({ error: "minPrice must be a non-negative number" });
      }
      values.push(parsedMinPrice);
      whereClauses.push(`p.price >= $${values.length}`);
    }

    if (maxPrice !== "") {
      const parsedMaxPrice = Number(maxPrice);
      if (Number.isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
        return res.status(400).json({ error: "maxPrice must be a non-negative number" });
      }
      values.push(parsedMaxPrice);
      whereClauses.push(`p.price <= $${values.length}`);
    }

    if (minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice)) {
      return res.status(400).json({ error: "minPrice cannot be greater than maxPrice" });
    }

    if (inStock === "true") {
      whereClauses.push("p.inventory > 0");
    }

    const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS["name-asc"];
    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereSql}`,
      values
    );
    const total = countResult.rows[0].total;

    const dataValues = [...values, limitNumber, offset];
    const limitPlaceholder = `$${dataValues.length - 1}`;
    const offsetPlaceholder = `$${dataValues.length}`;

    const productsResult = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
      dataValues
    );

    res.json({
      products: productsResult.rows,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: total === 0 ? 0 : Math.ceil(total / limitNumber),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/products  (admin only)
async function createProduct(req, res, next) {
  try {
    const { name, description, price, category_id, image_url, inventory } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category_id, image_url, inventory)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, category_id, image_url, inventory || 0]
    );

    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id  (admin only)
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, inventory } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, category_id = $4, image_url = $5, inventory = $6
       WHERE id = $7 RETURNING *`,
      [name, description, price, category_id, image_url, inventory, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ product: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id  (admin only)
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
