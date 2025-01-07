const express = require('express');
const { initPayment,updatePaymentStatus, failPaymentStatus ,myPayments, allPayments,PaypalInit,PaypalSuccess,PaypalCancel} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints for handling payments
 */

/**
 * @swagger
 * /api/pay/init-payment:
 *   post:
 *     summary: Initializes a payment process.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to be paid (in the smallest currency unit, e.g., paise or cents).
 *               orderId:
 *                 type: string
 *                 description: Unique order identifier.
 *               userId:
 *                 type: integer
 *                 description: User ID making the payment.
 *     responses:
 *       200:
 *         description: Payment initialization was successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentLink:
 *                   type: string
 *                   description: The URL to proceed with payment.
 *                 orderId:
 *                   type: string
 *                   description: The unique order ID for the payment.
 *       400:
 *         description: Bad Request - Invalid input data.
 *       500:
 *         description: Server error while initializing payment.
 */

/**
 * @swagger
 * /api/pay/my-payments:
 *   get:
 *     summary: Fetches all payments made by the authenticated user.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments made by the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paymentId:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                     description: Amount paid.
 *                   paymentStatus:
 *                     type: string
 *                     description: Status of the payment (e.g., successful, failed).
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the payment was made.
 *       401:
 *         description: Unauthorized - Invalid token.
 *       404:
 *         description: Not Found - No payments found for the user.
 */

/**
 * @swagger
 * /api/pay/get-all-payments:
 *   get:
 *     summary: Fetches all payments (Admin).
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments in the system.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   paymentId:
 *                     type: integer
 *                   amount:
 *                     type: number
 *                   paymentStatus:
 *                     type: string
 *                   userId:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error while fetching payments.
 */

/**
 * @swagger
 * /api/pay/update-payment-status:
 *   patch:
 *     summary: Updates the status of a payment.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: integer
 *                 description: The ID of the payment whose status needs to be updated.
 *               status:
 *                 type: string
 *                 enum: [successful, failed, pending]
 *                 description: The new status for the payment.
 *     responses:
 *       200:
 *         description: Payment status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Payment status updated successfully.'
 *       400:
 *         description: Bad Request - Invalid payment ID or status.
 *       404:
 *         description: Not Found - Payment not found.
 *       500:
 *         description: Server error while updating the payment status.
 */

/**
 * @swagger
 * /api/pay/set-payment-failed:
 *   patch:
 *     summary: Marks a payment as failed.
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentId:
 *                 type: integer
 *                 description: The ID of the payment to mark as failed.
 *               reason:
 *                 type: string
 *                 description: The reason for marking the payment as failed.
 *     responses:
 *       200:
 *         description: Payment marked as failed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Payment marked as failed.'
 *       400:
 *         description: Bad Request - Invalid payment ID or reason.
 *       404:
 *         description: Not Found - Payment not found.
 *       500:
 *         description: Server error while marking the payment as failed.
 */


router.post('/init-payment', authenticate, initPayment);
router.get('/my-payments', authenticate, myPayments);
router.get('/get-all-payments',allPayments);
router.patch('/update-payment-status',updatePaymentStatus);
router.patch('/set-payment-failed',failPaymentStatus);
router.post('/init-paypal',authenticate, PaypalInit);
router.get('/paypal-success',PaypalSuccess);
router.get('/paypal-fail',PaypalCancel)
module.exports = router;
