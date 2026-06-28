const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;


    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
    success: true,
    message: "Registration Successful",
    user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  },
});
    

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Login part
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
      
        if (!email || !password) {
            return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }
    
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
          success: false,
          message: "User not found",
        });
    }
    

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid Password",
        });
    }
    

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
    
    res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
    
} catch (error) {
    console.log(error);
    
    res.status(500).json({
        success: false,
        message: "Server Error",
    });
}
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
};