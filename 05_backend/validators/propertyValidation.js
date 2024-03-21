const validateProperty = (propertyData) => {
  const { title, description, category, price, location, country } =
    propertyData;

  // validate title
  if (!title || typeof title !== "string") {
    throw new Error("Title cannot be empty and must be a string");
  }

  // validate description
  if (typeof description !== "string") {
    throw new Error("Description must be a string");
  }

  // validate category
  if (!category || typeof category !== "string") {
    throw new Error("Category cannot be empty and must be a string");
  }

  // validate price
  if (!price || typeof price !== "number") {
    throw new Error("Price cannot be empty and must be a number");
  }

  // validate location
  if (!location || typeof location !== "string") {
    throw new Error("Location cannot be empty and must be a string");
  }

  // validate country
  if (!country || typeof country !== "string") {
    throw new Error("Country cannot be empty and must be a string");
  }

  // No validation errors
  return null;
};

module.exports = { validateProperty };
