const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");

// Load the backend .env file
dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

// Connect to the PostgreSQL database
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "ecommerce_db"
});


/*
 * Get all orders belonging to a specific user.
 * user, orders, order_items, products
 */
async function getOrderHistory(userID) {

    const query = `
        SELECT
            o.orderID,
            o.userID,
            o.created_at,
            o.total_price,
            o.order_status,

            oi.productID,
            oi.quantity,
            oi.price_at_purchase,

            p.product_name,
            p.description

        FROM orders o

        LEFT JOIN order_items oi
            ON o.orderID = oi.orderID

        LEFT JOIN products p
            ON oi.productID = p.productID

        WHERE o.userID = $1

        ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query, [userID]);

    const orders = {};

    result.rows.forEach((row) => {

        if (!orders[row.orderid]) {

            orders[row.orderid] = {
                orderID: row.orderid,
                userID: row.userid,
                created_at: row.created_at,
                total_price: row.total_price,
                order_status: row.order_status,
                items: []
            };
        }

        // Only add an item if the order actually has one
        if (row.productid) {

            orders[row.orderid].items.push({
                productID: row.productid,
                product_name: row.product_name,
                description: row.description,
                quantity: row.quantity,
                price_at_purchase: row.price_at_purchase
            });
        }
    });

    return Object.values(orders);
}


module.exports = {
    getOrderHistory
};