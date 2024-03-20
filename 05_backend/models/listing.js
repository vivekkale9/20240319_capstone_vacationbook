var mongoose = require("mongoose");

const listingSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: { 
      type: String,
      enum: ["Beach","Mountain", "Boat", "Cities", "Castles", "Pool", "Camping", "Farm", "Arctic", "Nature", "Treehouse", "Island", "Lighthouse"], 
    },
    image: {
      url : String,
      filename : String
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
      {
        type : Schema.Types.ObjectId,
        ref : "Review"
      }
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User"
    },
    geometry : {
      type : {
        type : String,
        enum : ["Point"],
        required : true
      },
      coordinates : {
        // coordinates are in array format.
        type : [Number],
        required : true
      },
    },
    status : {
      type : String,
      required : true,
    }
  });

// Create the Listing model
const Listing = mongoose.model("Listing", listingSchema);

// Export the Listing model
module.exports = Listing;