// Import middleware
const { verifyToken } = require("../middleware/auth");

// Internal imports
const { validateReview } = require("../validators/reviewValidation");
require("dotenv").config();

// Importing schemas
const Review = require("../models/review");

// API endpoint to post a new review
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
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// API endpoint to get all reviews by propertyID
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
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// API endpoint to update a review
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
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// API endpoint to delete review
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
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = {
  newReview,
  getReviewByPropertyID,
  updateReview,
  deleteReview,
};
