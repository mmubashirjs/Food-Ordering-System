const express = require("express");

const router = express.Router();

const { registerUser, loginUser, changePassword } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protect, changePassword);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Welcome User",
    user: req.user,
  });
});

module.exports = router;