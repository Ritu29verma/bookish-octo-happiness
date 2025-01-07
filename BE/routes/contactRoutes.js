const express = require('express');
const messageController = require('../controllers/contactController');
const router = express.Router();

// Route to save a message
router.post('/contact', messageController.saveMessage);

// Route to get all messages
router.get('/all', messageController.getAllMessages);

module.exports = router;
