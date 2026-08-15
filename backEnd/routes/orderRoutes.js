const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, createOrder);
router.get("/my-orders", requireAuth, getMyOrders);
router.get("/:id", requireAuth, getOrderById);

module.exports = router;
