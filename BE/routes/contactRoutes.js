const express = require('express');
const messageController = require('../controllers/contactController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: API endpoints for handling contact requests
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Save a contact message.
 *     tags: [Feedback]
 *     description: Stores a contact message from a user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user sending the message.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "johndoe@example.com"
 *               message:
 *                 type: string
 *                 description: The message content.
 *                 example: "I have an issue with your service."
 *     responses:
 *       201:
 *         description: Message saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message saved successfully"
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       500:
 *         description: Internal server error while saving the message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/all:
 *   get:
 *     summary: Retrieve all contact messages.
 *     tags: [Feedback]
 *     description: Fetches all contact messages from the database, ordered by creation date in descending order.
 *     responses:
 *       200:
 *         description: Successfully retrieved all messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique identifier for the message.
 *                       name:
 *                         type: string
 *                         description: Name of the user who sent the message.
 *                       email:
 *                         type: string
 *                         description: Email address of the user.
 *                       message:
 *                         type: string
 *                         description: The content of the message.
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of when the message was created.
 *       500:
 *         description: Failed to retrieve messages due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve messages."
 *                 error:
 *                   type: string
 *                   description: Detailed error message.
 */



// Route to save a message
router.post('/contact', messageController.saveMessage);

// Route to get all messages
router.get('/all', messageController.getAllMessages);

module.exports = router;
