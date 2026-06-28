const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  placeOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/place", authMiddleware, placeOrder);

router.get("/", authMiddleware, adminMiddleware, getOrders);

router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;