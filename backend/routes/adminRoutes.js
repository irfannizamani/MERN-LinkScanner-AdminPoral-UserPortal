const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET all admins
router.get('/admins', adminController.getAdmins);

// POST login for admin
router.post('/login', adminController.loginAdmin);

module.exports = router;
