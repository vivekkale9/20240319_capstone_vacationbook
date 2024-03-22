// Import middleware
const { verifyToken } = require("../middleware/auth");

// Internal imports
const { validateReview } = require("../validators/reviewValidation");
require("dotenv").config();

// Importing schemas
const Review = require("../models/review");

/**
 * Adds a new review for a property.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the property ID in the query and review details in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {AuthorizationError} - If the user is not authorized to post a review.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const newReview =
  (verifyToken,
  async (req, res) => {
    try {
      const userData = req.decoded;

      // provide property id in the query params
      const propertyID = req.query.propertyID;

      // Check if car model is provided
      if (!propertyID) {
        return res
          .status(400)
          .json({ error: "Property ID is required in query parameters." });
      }

      // Extract the details from the req body
      const { comment, rating } = req.body;

      // validate  inputs
      const validationError = validateReview(req.body);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      // create a new review using the Review model
      const review = new Review({
        comment: comment,
        rating: rating,
        author: userData.email,
        propertyID: propertyID,
      });

      // save the review to the database
      const savedReview = await review.save();

      res.status(201).json({
        success: true,
        message: "Review posted successfully!",
        property: savedReview,
      });
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "ValidationError") {
        // Handle validation errors
        return res.status(400).json({ error: error.message });
      } else if (error.name === "AuthorizationError") {
        // Handle authorization errors
        return res
          .status(403)
          .json({ error: "You are not authorized to post a review." });
      } else if (error.name === "DatabaseConnectionError") {
        // Handle database connection errors
        return res.status(500).json({ error: "Database connection error" });
      } else {
        // Handle other errors with a generic message
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

/**
 * Retrieves reviews for a property by its ID.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the property ID in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const getReviewByPropertyID =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the location ID from the request body
      const propertyID = req.query.propertyID;

      // Check if car model is provided
      if (!propertyID) {
        return res
          .status(400)
          .json({ error: "Property ID is required in query parameters." });
      }

      // Find the car by its location ID
      const review = await Review.find({ propertyID });

      // Check if the car exists
      if (!review) {
        return res.status(404).json({ message: "No reviews for the property" });
      }

      // Return the car details
      res.status(200).json(review);
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "ValidationError") {
        // Handle validation errors
        return res.status(400).json({ error: error.message });
      } else if (error.name === "DatabaseConnectionError") {
        // Handle database connection errors
        return res.status(500).json({ error: "Database connection error" });
      } else {
        // Handle other errors with a generic message
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

/**
 * Updates a review in the database.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the review ID in the query and updated review details in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {AuthorizationError} - If the user is not authorized to update the review.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const updateReview =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the review ID from the query parameters
      const reviewID = req.query.reviewID;
      const userData = req.decoded;

      // Check if the review ID is provided
      if (!reviewID) {
        return res
          .status(400)
          .json({ error: "Review ID is required in query parameters." });
      }

      // Find the review by ID
      const review = await Review.findById(reviewID);

      // Check if the user is the author of the review
      if (review.author !== userData.email) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to update this review",
        });
      }

      // Extract the new property details from the request body
      const reviewUpdates = req.body;

      // Find the car by its ID and update its price
      const updatedReview = await Review.findByIdAndUpdate(
        reviewID,
        reviewUpdates,
        { new: true }
      );

      // Return the updated car
      res.status(200).json(updatedReview);
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "ValidationError") {
        // Handle validation errors
        return res.status(400).json({ error: error.message });
      } else if (error.name === "AuthorizationError") {
        // Handle authorization errors
        return res
          .status(403)
          .json({ error: "You are not authorized to update this review." });
      } else if (error.name === "DatabaseConnectionError") {
        // Handle database connection errors
        return res.status(500).json({ error: "Database connection error" });
      } else {
        // Handle other errors with a generic message
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

/**
 * Deletes a review from the database.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the review ID in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {AuthorizationError} - If the user is not authorized to delete the review.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const deleteReview =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the review ID from the request body
      const reviewID = req.query.reviewID;
      const userData = req.decoded;

      // Check if the review ID is provided
      if (!reviewID) {
        return res
          .status(400)
          .json({ error: "Review ID is required in query parameters." });
      }

      // Find the review by ID
      const review = await Review.findById(reviewID);

      // Check if the user is the author of the review
      if (review.author !== userData.email) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to delete this review",
        });
      }

      // Find the car by its ID and delete it
      const deletedReview = await Review.findByIdAndDelete(reviewID);

      // Check if the car exists
      if (!deletedReview) {
        return res.status(404).json({ message: "Review not found." });
      }

      // Return a success message
      res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "AuthorizationError") {
        // Handle authorization errors
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this review." });
      } else if (error.name === "DatabaseConnectionError") {
        // Handle database connection errors
        return res.status(500).json({ error: "Database connection error" });
      } else {
        // Handle other errors with a generic message
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

module.exports = {
  newReview,
  getReviewByPropertyID,
  updateReview,
  deleteReview,
};
