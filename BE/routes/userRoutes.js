const express = require('express');
const router = express.Router();
const {getAllUsers} = require('../controllers/userController');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/users/getusers:
 *   get:
 *     summary: Fetches all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */


router.get('/getusers', getAllUsers);

module.exports = router;
