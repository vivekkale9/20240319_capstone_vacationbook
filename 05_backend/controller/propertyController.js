//Internal imports
const { verifyToken, isAdmin } = require("../middleware/auth");
require("dotenv").config();
const {validateProperty} = require("../validators/propertyValidation")

// schema imports
const Property = require("../models/listing");

// API endpoint for getting all properties
const getAllproperties = async (req,res) => {
    try{
        // Fetch all properties from the database
        const properties = await Property.find()

        // Check if there are no cars found
        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: "No properties found." });
        }

        // Return the list of cars
        res.status(200).json(properties);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

// API endpoint for adding a new property
const addProperty = (verifyToken, async (req,res) => {
    try{
        const userData = req.decoded; // Decoded user information from the token
        
        // Extract car details from request body
      const {
        title,description,category,price,location,country
      } = req.body;

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
            title : title,
            description : description,
            category : category,
            price : price,
            location : location,
            country : country,
            owner : userData.email,
        })

        // Save the property to the database
        const savedProperty = await newProperty.save();

        res.status(201).json({
            success: true,
            message: "Property posted successfully!",
            property: savedProperty,
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

// API endpoint for searching property by name
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
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

// API endpoint to get property by id
const getPropertyByID = (verifyToken,async (req, res) => {
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
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// API endpoint to update property
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
      const propertyDetail  = req.body;

      // Check if the car ID is provided
      if (!propertyID) {
        return res
          .status(400)
          .json({ error: "Property ID is required in query parameters." });
      }

      // Find the car by its ID and update its price
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyID,
        propertyDetail,
        { new: true }
      );

      // Return the updated car
      res.status(200).json(updatedProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// API endpoint to delete property
const deleteProperty =
  (verifyToken,
  async (req, res) => {
    try {
      // Extract the car ID from the request body
      const propertyID  = req.query.propertyID;
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

      // Find the car by its ID and delete it
      const deletedProperty = await Property.findByIdAndDelete(propertyID);

      // Check if the car exists
      if (!deletedProperty) {
        return res.status(404).json({ message: "Property not found." });
      }

      // Return a success message
      res.status(200).json({ message: "Property deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = {addProperty,getAllproperties,getPropertyByName,getPropertyByID,updateProperty,deleteProperty}