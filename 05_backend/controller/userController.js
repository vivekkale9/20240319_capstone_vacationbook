// External imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Import middleware
const { verifyToken } = require("../middleware/auth");

// Internal imports
const { validateUser } = require("../validators/userValidation");
require("dotenv").config();

// Importing schemas
const User = require("../models/user");

// API for registering a new user
const register = async (req, res) => {
  try {
    // Extract user details from request body
    const userData = req.body;

    // validate the req.body
    validateUser(userData);

    // Check if the user already exists with the provided email or phone number
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { phone_number: userData.phone_number }],
    });
    if (existingUser) {
      return res.status(409).json({
        error: "Email or Phone is already in use.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Create a new user
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "User signed up successfully!",
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    // Check if the error is a validation error
    if (
      error.name === "ValidationError" ||
      error.message.startsWith("ValidationError")
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// API endpoint for user login
const login = async (req, res) => {
  try {
    const userData = req.body;
    const userName = userData.userName;
    const password = userData.password;

    // validate  inputs
    const validationError = validateUser(userData);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // Find user by email
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({
        error: "Invalid username.",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid  password.",
      });
    }
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful.",
      token: token,
      role: user.role,
      userId: user._id,
      expiresIn: 3600, // Token expires in 1 Month
    });
    console.log("success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// API endpoint to get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.query;

    // Find the user in the database using the provided userId
    const user = await User.findOne({ _id: userId });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user details
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// API endpoint to update user
const updateUser =
  (verifyToken,
  async (req, res) => {
    try {
      const { userId } = req.query; // Extract userId from query parameters
      const updateFields = req.body; // Extract fields to update from the request body

      // Check if userId is provided
      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId is required in the query parameters" });
      }

      // Check if the authenticated user is authorized to update this user's information
      if (
        req.user &&
        req.user.user_Id &&
        req.user.user_Id.toString() !== userId
      ) {
        return res.status(403).json({
          message:
            "Unauthorized - You do not have permission to update this user",
        });
      }

      // Find the user in the database using the provided userId
      const userToUpdate = await User.findById(userId);

      // Check if the user exists
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user information in the database
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        updateFields,
        { new: true }
      );

      res.status(200).json({
        message: "User information updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = { register, login, getUserById, updateUser };
