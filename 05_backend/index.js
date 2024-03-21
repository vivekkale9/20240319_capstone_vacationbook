// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Create an Express application
const app = express();

// importing cors
const cors = require("cors");

// Load environment variables from .env file
require("dotenv").config();

// Set the port to listen for incoming requests
const port = process.env.SERVER_PORT;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// cors middleware
app.use(cors());

//import route handlers
const userRoute = require("./router/userRoute");
const propertyRoute = require("./router/propertyRoute");
const reviewRoute = require("./router/reviewRoute");

//mount route handlers
app.use("/users", userRoute);
app.use("/properties", propertyRoute);
app.use("/reviews", reviewRoute);

// Connect to MongoDB asynchronously
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if unable to connect
  }
};

// Start the server after connecting to MongoDB
const startServer = async () => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};
// Call the asynchronous functions
connectToMongoDB().then(startServer);

// Export the Express application
module.exports = app;
