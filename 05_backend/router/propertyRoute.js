// external imports
const express = require('express');
const router = express.Router();

// internal imports
const propertyController = require("../controller/propertyController")

// Import middleware
const { verifyToken } = require("../middleware/auth");

// unprotected routes
router.get('/allproperties',propertyController.getAllproperties)
router.get('/searchbyname',propertyController.getPropertyByName)

//protected routes
router.use(verifyToken);
router.post('/addproperty',propertyController.addProperty)
router.get('/propertybyid',propertyController.getPropertyByID)
router.put('/updateproperty',propertyController.updateProperty)
router.get('/deleteproperty',propertyController.deleteProperty)

module.exports = router;