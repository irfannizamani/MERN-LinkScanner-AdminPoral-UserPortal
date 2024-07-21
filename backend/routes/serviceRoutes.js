const express = require('express');
const router = express.Router();
const statusController = require('../controllers/serviceController');

// POST check service status
router.post('/check', statusController.checkServiceStatus);

module.exports = router;