var mongoose = require("mongoose");

// Create the user schema
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: true,
    minlength: 4,
    maxlength: 20,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxlength: 100,
    validate: {
      validator: function (value) {
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 200,
  },
  mobileNumber: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 10,
  },
  gender: {
    type: String,
    trim: true,
    enum: ["male", "female", "other"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
