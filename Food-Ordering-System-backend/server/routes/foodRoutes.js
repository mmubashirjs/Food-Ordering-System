const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


const { addFood, getFoods, updateFood, deleteFood } = require("../controllers/foodController");

router.post("/add", authMiddleware, adminMiddleware, addFood);

router.get("/", getFoods);

router.put("/:id", authMiddleware, adminMiddleware, updateFood);

router.delete("/:id", authMiddleware, adminMiddleware, deleteFood);

module.exports = router;