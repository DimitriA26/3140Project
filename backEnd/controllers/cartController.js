const pool = require("../config/database");

// Finds the current user's cart, creating one if it doesn't exist yet.
async function getOrCreateCart(userId) {
  const existing = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const created = await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  return created.rows[0];
}

// GET /api/cart  (requires requireAuth)
async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id);

    const items = await pool.query(
      `SELECT cart_items.id, cart_items.quantity, products.id AS product_id,
              products.name, products.price, products.image_url
       FROM cart_items
       JOIN products ON products.id = cart_items.product_id
       WHERE cart_items.cart_id = $1`,
      [cart.id]
    );

    res.json({ cartId: cart.id, items: items.rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/cart/items  (requires requireAuth)  body: { productId, quantity }
async function addItem(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "productId and quantity are required" });
    }

    const cart = await getOrCreateCart(req.user.id);

    const existingItem = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cart.id, productId]
    );

    if (existingItem.rows.length > 0) {
      const updated = await pool.query(
        "UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
        [quantity, existingItem.rows[0].id]
      );
      return res.json({ item: updated.rows[0] });
    }

    const inserted = await pool.query(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [cart.id, productId, quantity]
    );

    res.status(201).json({ item: inserted.rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/items/:itemId  (requires requireAuth)  body: { quantity }
async function updateItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ item: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/items/:itemId  (requires requireAuth)
async function removeItem(req, res, next) {
  try {
    const { itemId } = req.params;

    const result = await pool.query(
      "DELETE FROM cart_items WHERE id = $1 RETURNING id",
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem };
