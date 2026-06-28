
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  role: { type: String, default: "customer" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@food.com" });
    if (existing) {
      console.log(" Admin already exists!");
      console.log("   Email:    admin@food.com");
      console.log("   Password: admin123");
      console.log("   Role:     " + existing.role);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      name: "Admin",
      email: "admin@food.com",
      password: hashedPassword,
      phone: "0000000000",
      role: "admin",
    });

    console.log(" Admin user created successfully!");
    console.log("   Email:    admin@food.com");
    console.log("   Password: admin123");
    console.log("   ID:       " + admin._id);

    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB");
  } catch (error) {
    console.error(" Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
