const express = require('express');
const { initPayment,updatePaymentStatus, failPaymentStatus ,myPayments, allPayments,PaypalInit,PaypalSuccess,PaypalCancel} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/init-payment', authenticate, initPayment);
router.get('/my-payments', authenticate, myPayments);
router.get('/get-all-payments',allPayments);
router.patch('/update-payment-status',updatePaymentStatus);
router.patch('/set-payment-failed',failPaymentStatus);
router.post('/init-paypal',authenticate, PaypalInit);
router.get('/paypal-success',PaypalSuccess);
router.get('/paypal-fail',PaypalCancel)
module.exports = router;
