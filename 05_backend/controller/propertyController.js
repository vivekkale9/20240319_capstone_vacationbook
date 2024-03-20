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

module.exports = {addProperty,getAllproperties}