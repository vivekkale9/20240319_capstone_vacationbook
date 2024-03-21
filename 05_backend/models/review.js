const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    maxlength: 100,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: String,
    required: true,
  },
  propertyID: {
    type: ObjectId,
    required: true,
  },
});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema);

// Export the Listing model
module.exports = Review;
