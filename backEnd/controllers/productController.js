const pool = require("../config/database");

// GET /api/products
async function getAllProducts(req, res, next) {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json({ products: result.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

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
