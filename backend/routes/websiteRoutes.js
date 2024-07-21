const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const authAdminMiddleware  = require('../middlewares/authAdminMiddleware');

// GET all websites
router.get('/web', websiteController.getWebsites);

// POST add website
router.post('/web', authAdminMiddleware,websiteController.addWebsite);

// DELETE website by ID
router.delete('/web/:id', authAdminMiddleware,websiteController.deleteWebsite);

// PUT update status of all websites
router.put('/web/update-statuses', websiteController.updateWebsiteStatuses);

module.exports = router;
