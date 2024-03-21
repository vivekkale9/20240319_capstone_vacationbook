var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: [
      "Beach",
      "Mountain",
      "Boat",
      "Cities",
      "Castles",
      "Pool",
      "Camping",
      "Farm",
      "Arctic",
      "Nature",
      "Treehouse",
      "Island",
      "Lighthouse",
    ],
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      // required : true
    },
    coordinates: {
      // coordinates are in array format.
      type: [Number],
      // required : true
    },
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
});

// Create the Listing model
const Listing = mongoose.model("Listing", listingSchema);

// Export the Listing model
module.exports = Listing;
