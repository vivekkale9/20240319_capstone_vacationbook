//Internal imports
const { verifyToken, isAdmin } = require("../middleware/auth");
require("dotenv").config();
const { validateProperty } = require("../validators/propertyValidation");

// schema imports
const Property = require("../models/listing");

/**
 * Retrieves all approved properties from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 */
const getAllproperties = async (req, res) => {
  try {
    // Fetch all the approved properties from the database
    const properties = await Property.find({ status: "approved" });

    // Check if there are no cars found
    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "No properties found." });
    }

    // Return the list of cars
    res.status(200).json(properties);
  } catch (error) {
    // Handle different error scenarios
    if (error.name === "ValidationError") {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    } else {
      // Handle other errors with a generic message
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**
 * Adds a new property to the database.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing property details in the body and user information in the decoded token.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error in the property details.
 * @throws {AuthorizationError} - If the user is not authorized to add a property.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 * @throws {UnexpectedInputFormatError} - If the input format is unexpected.
 */
const addProperty =
  (verifyToken,
  async (req, res) => {
    try {
      const userData = req.decoded; // Decoded user information from the token

      // Extract car details from request body
      const { title, description, category, price, location, country } =
        req.body;

      // validate  inputs
      const validationError = validateProperty(req.body);
      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      // create a new property using the property model
      const newProperty = new Property({
        title: title,
        description: description,
        category: category,
        price: price,
        location: location,
        country: country,
        owner: userData.email,
      });

      // Save the property to the database
      const savedProperty = await newProperty.save();

      res.status(201).json({
        success: true,
        message: "Property posted successfully!",
        property: savedProperty,
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
          .json({ error: "You are not authorized to add a property." });
      } else if (error.name === "DatabaseConnectionError") {
        // Handle database connection errors
        return res.status(500).json({ error: "Database connection error" });
      } else if (error.name === "UnexpectedInputFormatError") {
        // Handle unexpected input format errors
        return res.status(400).json({ error: "Unexpected input format" });
      } else {
        // Handle other errors with a generic message
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

/**
 * Retrieves properties from the database by their name.
 * @param {Object} req - Express request object containing the property name in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {MongoError} - If there is a MongoDB related error.
 * @throws {CastError} - If the property ID provided is not in a valid format.
 */
const getPropertyByName = async (req, res) => {
  try {
    // Extract the car model from the query parameters
    const propertyName = req.query.propertyName;

    // Check if car model is provided
    if (!propertyName) {
      return res
        .status(400)
        .json({ error: "Property Name is required in query parameters." });
    }

    // Find the cars by their model
    const property = await Property.find({ title: propertyName });

    // Check if cars were found
    if (!property || property.length === 0) {
      return res
        .status(404)
        .json({ message: "No properties found with the provided name." });
    }

    // Return all details of the cars found
    res.status(200).json(property);
  } catch (error) {
    // Handle different error scenarios
    if (error.name === "ValidationError") {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    } else if (error.name === "MongoError") {
      // Handle MongoDB errors
      return res.status(400).json({ error: "MongoDB error" });
    } else if (error.name === "CastError") {
      // Handle cast errors (e.g., invalid object ID)
      return res.status(400).json({ error: "Invalid property ID format" });
    } else {
      // Handle other errors with a generic message
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

/**
 * Retrieves a property from the database by its ID.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the property ID in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {CastError} - If the property ID provided is not in a valid format.
 * @throws {AuthorizationError} - If the user is not authorized to access the property.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const getPropertyByID =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the car model from the query parameters
      const propertyID = req.query.propertyID;

      // Check if car model is provided
      if (!propertyID) {
        return res
          .status(400)
          .json({ error: "Property Name is required in query parameters." });
      }

      // Find the cars by their model
      const property = await Property.find({ _id: propertyID });

      // Check if cars were found
      if (!property || property.length === 0) {
        return res
          .status(404)
          .json({ message: "No properties found with the provided name." });
      }

      // Return all details of the cars found
      res.status(200).json(property);
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "ValidationError") {
        // Handle validation errors
        return res.status(400).json({ error: error.message });
      } else if (error.name === "CastError") {
        // Handle cast errors (e.g., invalid object ID)
        return res.status(400).json({ error: "Invalid property ID format" });
      } else if (error.name === "AuthorizationError") {
        // Handle authorization errors
        return res
          .status(403)
          .json({ error: "You are not authorized to access this property." });
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
 * Updates a property in the database.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the property ID in the query and updated property details in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {AuthorizationError} - If the user is not authorized to update the property.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const updateProperty =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the property ID from the query parameters
      const propertyID = req.query.propertyID;
      const userData = req.decoded;

      // Find the property by ID
      const property = await Property.findById(propertyID);

      // Check if the user is the owner of the property
      if (property.owner !== userData.email) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to update this property",
        });
      }

      // Extract the new property details from the request body
      const propertyDetail = req.body;

      // Check if the car ID is provided
      if (!propertyID) {
        return res
          .status(400)
          .json({ error: "Property ID is required in query parameters." });
      }

      // Find the Property by its ID and update
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyID,
        propertyDetail,
        { new: true }
      );

      // Return the updated car
      res.status(200).json(updatedProperty);
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "ValidationError") {
        // Handle validation errors
        return res.status(400).json({ error: error.message });
      } else if (error.name === "AuthorizationError") {
        // Handle authorization errors
        return res
          .status(403)
          .json({ error: "You are not authorized to update this property." });
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
 * Deletes a property from the database.
 * @param {Function} verifyToken - Function to verify the authentication token.
 * @param {Object} req - Express request object containing the property ID in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {AuthorizationError} - If the user is not authorized to delete the property.
 * @throws {DatabaseConnectionError} - If there is an error with the database connection.
 */
const deleteProperty =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the property ID from the request body
      const propertyID = req.query.propertyID;
      const userData = req.decoded;

      // Find the property by ID
      const property = await Property.findById(propertyID);

      // Check if the user is the owner of the property
      if (property.owner !== userData.email) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to remove this property",
        });
      }

      // Delete all the reviews for that property
      await Review.deleteMany({ propertyID: propertyID });

      // Find the car by its ID and delete it
      const deletedProperty = await Property.findByIdAndDelete(propertyID);

      // Check if the car exists
      if (!deletedProperty) {
        return res.status(404).json({ message: "Property not found." });
      }

      // Return a success message
      res.status(200).json({ message: "Property deleted successfully." });
    } catch (error) {
      // Handle different error scenarios
      if (error.name === "AuthorizationError") {
        // Handle authorization errors
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this property." });
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
  addProperty,
  getAllproperties,
  getPropertyByName,
  getPropertyByID,
  updateProperty,
  deleteProperty,
};
