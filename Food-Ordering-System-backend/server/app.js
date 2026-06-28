const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);


const User = require("./models/User");
const bcrypt = require("bcryptjs");
app.get("/api/seed-admin", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "admin@food.com" });
    if (existing) {
      return res.json({ success: false, message: "Admin already exists. Login with admin@food.com / admin123" });
    }
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@food.com",
      password: hashedPassword,
      phone: "0000000000",
      role: "admin",
    });
    res.json({ success: true, message: "Admin created! Email: admin@food.com | Password: admin123" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Food Ordering API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});