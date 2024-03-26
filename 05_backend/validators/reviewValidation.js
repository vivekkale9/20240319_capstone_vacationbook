const validateReview = (reviewData) => {
  const { comment, rating } = reviewData;

  if (comment) {
    if (typeof comment !== "string" || comment.length > 100) {
      throw new Error("comment must be string and less than 100 characters");
    }
  }

  if (rating) {
    if ( rating.length > 5) {
      throw new Error("rating should be less than 5");
    }
  }
};

module.exports = { validateReview };
