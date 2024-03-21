const {isAdmin} = require('../middleware/auth')
const Property = require("../models/listing");

// API endpoint to get all the properties which have pending
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
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to approve the properties
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
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });

  // API endpoint to reject the properties
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
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
  

module.exports = { approval, rejected, getAllproperties};