const pool = require("../config/database");

// POST /api/orders  (requires requireAuth)
// Checks out the user's current cart: calculates the total from real DB prices
// (never trusts a total from the frontend), creates the order, then empties the cart.
async function createOrder(req, res, next) {
  try {
    const cartResult = await pool.query("SELECT * FROM carts WHERE user_id = $1", [req.user.id]);
    const cart = cartResult.rows[0];

    if (!cart) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const itemsResult = await pool.query(
      `SELECT cart_items.quantity, products.id AS product_id, products.price
       FROM cart_items
       JOIN products ON products.id = cart_items.product_id
       WHERE cart_items.cart_id = $1`,
      [cart.id]
    );
    const items = itemsResult.rows;

    if (items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, 'pending') RETURNING *",
      [req.user.id, totalPrice]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/my-orders  (requires requireAuth)
async function getMyOrders(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ orders: result.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id  (requires requireAuth — customer sees only their own order, admin sees any)
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const orderResult = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const isOwner = order.user_id === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "You do not have access to this order" });
    }

    const itemsResult = await pool.query(
      `SELECT order_items.quantity, order_items.price_at_purchase,
              products.name, products.image_url
       FROM order_items
       JOIN products ON products.id = order_items.product_id
       WHERE order_items.order_id = $1`,
      [id]
    );

    res.json({ order, items: itemsResult.rows });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/orders  (admin only)
async function getAllOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT orders.*, users.name AS customer_name, users.email AS customer_email
       FROM orders
       JOIN users ON users.id = orders.user_id
       ORDER BY orders.created_at DESC`
    );
    res.json({ orders: result.rows });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/orders/:id/status  (admin only)  body: { status }
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
