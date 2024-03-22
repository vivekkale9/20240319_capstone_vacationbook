const {isAdmin} = require('../middleware/auth')
const Property = require("../models/listing");

/**
 * Retrieves all properties from the database with a specified status.
 * @param {boolean} isAdmin - Indicates whether the user is an admin or not.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {ValidationError} - If there is a validation error.
 * @throws {MongoError} - If a MongoDB related error occurs.
 */
const getAllproperties = (isAdmin,async (req, res) => {
  try {
    // Fetch all the pending properties from the database
    const properties = await Property.find({ status: "pending" });

    // Check if there are no cars found
    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "No properties found." });
    }

    // Return the list of cars
    res.status(200).json(properties);
  } catch (error) {
    // Handle different error scenarios
    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      // Handle duplicate key error (MongoError with code 11000)
      return res.status(409).json({ error: "Duplicate property found." });
    } else {
      // Handle other errors with a generic message
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

/**
 * Approves a property by updating its status to "approved" in the database.
 * @param {boolean} isAdmin - Indicates whether the user is an admin or not.
 * @param {Object} req - Express request object containing the property ID in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {CastError} - If the property ID provided is not in a valid format.
 */
const approval =
  (isAdmin,
  async (req, res) => {
    try {
      const propertyID = req.query.propertyID;

      // Update the status to "approved"
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyID,
        { status: "approved" },
        { new: true } // Returns the updated document
      );

      if (!updatedProperty) {
        return res.status(404).json({
          success: false,
          message: "Property not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Property approved successfully!",
        property: updatedProperty,
      });
    } catch (error) {
      // Handle different error scenarios
    if (error.name === 'CastError') {
      // Handle invalid propertyID format
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format",
      });
    } else {
      // Handle other errors with a generic message
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
    }
  });

/**
 * Removes a property from the database based on the provided property ID.
 * @param {boolean} isAdmin - Indicates whether the user is an admin or not.
 * @param {Object} req - Express request object containing the property ID in the query.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise representing the asynchronous operation.
 * @throws {CastError} - If the property ID provided is not in a valid format.
 */
  const rejected =  (isAdmin, async (req, res) => {
    try {
      const propertyID = req.query.propertyID;
  
      // Remove the property from the Property collection
      await Property.findByIdAndDelete(propertyID);
  
      // Send a response
      res.status(200).json({
        success: true,
        message: "Property removed successfully!",
        removedPropertyId: propertyID,
      });
    } catch (error) {
      if (error.name === 'CastError') {
        // Handle invalid propertyID format
        return res.status(400).json({
          success: false,
          message: "Invalid property ID format",
        });
      } else {
        // Handle other errors with a generic message
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }
    }
  });
  

module.exports = { approval, rejected, getAllproperties};