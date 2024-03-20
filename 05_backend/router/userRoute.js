// external imports
const express = require('express');
const router = express.Router();

// internal imports
const UserController = require("../controller/userController")

// Import middleware
const { verifyToken } = require("../middleware/auth"); 

// unprotected routes
router.post('/signup',UserController.register)
router.post('/login',UserController.login)
router.get('/userbyid',UserController.getUserById)

//protected routes
router.use(verifyToken);
router.put('/updateuser',UserController.updateUser)

module.exports = router;