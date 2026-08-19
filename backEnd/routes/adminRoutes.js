const express = require("express");
const router = express.Router();
const { getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Every route in this file requires a logged-in admin
router.use(requireAuth, requireAdmin);

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;
