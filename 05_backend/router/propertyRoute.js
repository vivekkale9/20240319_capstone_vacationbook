// external imports
const express = require("express");
const router = express.Router();
// Multer is a node.js middleware for handling multipart/form-data.
// To parse the form data we are using multer (Image)
const multer  = require('multer')
const {storage} = require("../cloudinary");
const upload = multer({ storage });

// internal imports
const propertyController = require("../controller/propertyController");

// Import middleware
const { verifyToken } = require("../middleware/auth");

// unprotected routes
router.get("/allproperties", propertyController.getAllproperties);
router.get("/searchbyname", propertyController.getPropertyByName);

//protected routes
router.use(verifyToken);
router.post("/addproperty",upload.single("listing[image]"), propertyController.addProperty);
router.get("/propertybyid", propertyController.getPropertyByID);
router.put("/updateproperty", propertyController.updateProperty);
router.get("/deleteproperty", propertyController.deleteProperty);

module.exports = router;
