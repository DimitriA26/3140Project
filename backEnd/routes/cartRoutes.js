const express = require("express");
const router = express.Router();
const { getCart, addItem, updateItem, removeItem } = require("../controllers/cartController");
const { requireAuth } = require("../middleware/auth");

// Every cart route requires a logged-in user
router.use(requireAuth);

router.get("/", getCart);
router.post("/items", addItem);
router.put("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);

module.exports = router;
