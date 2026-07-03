import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// =============================
// Register User
// POST /api/auth/create-account
// =============================
export const registerUser = async (req, res) => {
    console.log("Register endpoint hit");
    console.log(req.body);
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields.",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      accessToken: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:");
    console.error(error);

    res.status(500).json({
    message: error.message,
  });
 }
};

// =============================
// Login User
// POST /api/auth/login
// =============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      accessToken: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};