// external imports
const express = require("express");
const router = express.Router();

// internal imports
const reviewController = require("../controller/reviewController");

// Import middleware
const { verifyToken } = require("../middleware/auth");

// protected routes
router.use(verifyToken);
router.post("/postreview", reviewController.newReview);
router.get("/getreviewbypropertyid", reviewController.getReviewByPropertyID);
router.put("/updatereview", reviewController.updateReview);
router.delete("/deletereview", reviewController.deleteReview);

module.exports = router;
