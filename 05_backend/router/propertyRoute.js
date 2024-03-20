// external imports
const express = require('express');
const router = express.Router();

// internal imports
const propertyController = require("../controller/propertyController")

// Import middleware
const { verifyToken } = require("../middleware/auth");

// unprotected routes
router.get('/allproperties',propertyController.getAllproperties)

//protected routes
router.use(verifyToken);
router.post('/addproperty',propertyController.addProperty)

module.exports = router;