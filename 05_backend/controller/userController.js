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

/**
 * Registers a new user.
 * @param {Object} req - Express request object containing user details in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {MongoError} - If there is a MongoDB error.
 * @throws {InternalError} - If there is an internal server error.
 * @throws {AuthorizationError} - If the user is not authorized to access the resource.
 */
const register = async (req, res) => {
  try {
    // Extract user details from request body
    const userData = req.body;

    // validate the req.body
    validateUser(userData);

    // Check if the user already exists with the provided email or phone number
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { mobileNumber: userData.mobileNumber }],
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
    // Handle different error scenarios
    if (error.name === "ValidationError") {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    } else if (error.code === 11000) {
      // Handle duplicate key errors (MongoDB specific error)
      return res.status(409).json({ error: "Email or Phone is already in use." });
    } else if (error.name === 'MongoError' && error.code === 121) {
      // Handle document validation errors (MongoDB specific error)
      return res.status(400).json({ error: error.message });
    } else if (error.name === 'MongoError') {
      // Handle other MongoDB errors
      return res.status(500).json({ error: "Database error" });
    } else {
      // Handle other errors with a generic message
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**
 * Handles user login.
 * @param {Object} req - Express request object containing user credentials in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {MongoError} - If there is a MongoDB error.
 * @throws {InternalError} - If there is an internal server error.
 * @throws {AuthorizationError} - If the user is not authorized to access the resource.
 */
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
    // Handle different error scenarios
    if (error.name === "ValidationError") {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    } else if (error.code === 11000) {
      // Handle duplicate key errors (MongoDB specific error)
      return res.status(409).json({ error: "Email or Phone is already in use." });
    } else if (error.name === 'MongoError' && error.code === 121) {
      // Handle document validation errors (MongoDB specific error)
      return res.status(400).json({ error: error.message });
    } else if (error.name === 'MongoError') {
      // Handle other MongoDB errors
      return res.status(500).json({ error: "Database error" });
    } else {
      // Handle other errors with a generic message
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**
 * Fetches user details by their ID.
 * @param {Object} req - Express request object containing the user ID in the query parameters.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {CastError} - If the provided user ID has an invalid format.
 * @throws {InternalError} - If there is an internal server error.
 */
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
    // Handle different error scenarios
    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    } else if (error.name === 'CastError') {
      // Handle invalid ID format error
      return res.status(400).json({ error: "Invalid user ID" });
    } else {
      // Handle other errors with a generic message
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**
 * Updates user information.
 * @param {Object} verifyToken - Middleware function to verify user token.
 * @param {Object} req - Express request object containing the user ID in the query parameters and fields to update in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {CastError} - If the provided user ID has an invalid format.
 * @throws {InternalError} - If there is an internal server error.
 */
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
      if (error.name === 'ValidationError') {
        // Handle validation errors
        return res.status(400).json({ error: error.message });
      } else if (error.name === 'CastError') {
        // Handle invalid ID format error
        return res.status(400).json({ error: "Invalid user ID" });
      } else {
        // Handle other errors with a generic message
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

module.exports = { register, login, getUserById, updateUser };
