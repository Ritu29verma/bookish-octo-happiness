const express = require('express');
const { book , allappointments , reject , confirm , getAllNotifications,myappointments} = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API endpoints for managing appointments
 */

/**
 * @swagger
 * /api/appointments/book:
 *   post:
 *     summary: Books a new appointment.
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               barberId:
 *                 type: integer
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 clientName:
 *                   type: string
 *                 barberId:
 *                   type: integer
 *                 date:
 *                   type: string
 *                 time:
 *                   type: string
 *       400:
 *         description: Bad Request - Invalid input.
 */

/**
 * @swagger
 * /api/appointments/myappointments:
 *   get:
 *     summary: Fetches all appointments of a user.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user's appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   clientName:
 *                     type: string
 *                   barberId:
 *                     type: integer
 *                   date:
 *                     type: string
 *                   time:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid token.
 */

/**
 * @swagger
 * /api/appointments/allbookings:
 *   get:
 *     summary: Fetches all appointments (Admin).
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A list of all appointments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   clientName:
 *                     type: string
 *                   barberId:
 *                     type: integer
 *                   date:
 *                     type: string
 *                   time:
 *                     type: string
 */

/**
 * @swagger
 * /api/appointments/reject:
 *   post:
 *     summary: Rejects an appointment.
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Appointment rejected successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Appointment rejected successfully'
 *       400:
 *         description: Bad Request - Invalid input.
 *       404:
 *         description: Not Found - Appointment not found.
 */

/**
 * @swagger
 * /api/appointments/confirm:
 *   post:
 *     summary: Confirms an appointment.
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Appointment confirmed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Appointment confirmed successfully'
 *       400:
 *         description: Bad Request - Invalid input.
 *       404:
 *         description: Not Found - Appointment not found.
 */

/**
 * @swagger
 * /api/appointments/notifications:
 *   get:
 *     summary: Fetches all notifications for a user.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of notifications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - Invalid token.
 */

router.post('/book', authenticate, book );
router.get('/myappointments', authenticate, myappointments );
router.get('/allbookings',allappointments);
router.post('/reject',reject);
router.post('/confirm',confirm);
router.get('/notifications', getAllNotifications);


module.exports = router;
