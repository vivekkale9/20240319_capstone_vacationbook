const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// protected routes
router.use(verifyToken,isAdmin)
router.put('/adminapproval',adminController.approval)
router.delete('/adminrejection',adminController.rejected)

module.exports = router;