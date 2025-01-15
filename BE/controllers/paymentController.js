require('dotenv').config(); 
const Razorpay = require('razorpay');
const User = require('../models/User')
const createOrder = require('../config/razorpay')
const Appointment = require('../models/Appointment')
const Payment = require('../models/Payment')
const client = require('../config/paypal')
const paypal = require('@paypal/checkout-server-sdk');
const Stripe = require('stripe');


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });


exports.initPayment = async (req, res) => {
    const { appointment_id } = req.body;
    const { userId } = req.user;

    if (!userId || !appointment_id) {
        return res.status(400).json({ error: 'User ID and Appointment ID are required.' });
    }

    try {
        // Validate appointment
        const appointment = await Appointment.findByPk(appointment_id);
        if (!appointment || appointment.user_id !== userId) {
            return res.status(404).json({ error: 'Invalid appointment.' });
        }

        // Default payment amount
        const amount = 1; // Default amount

        // Check if a payment already exists for the appointment
        let payment = await Payment.findOne({ where: { appointment_id } });
        const razorpayOrder = await createOrder(amount);
        if (payment) {
            // Update existing payment record
            payment.amount = amount;
            payment.payment_status = 'pending';
            payment.transaction_id =razorpayOrder.id;
            payment.updatedAt = new Date();
            await payment.save();
        } else {
            // Create Razorpay order

            // Create a new payment record
            payment = await Payment.create({
                user_id: userId,
                appointment_id,
                amount,
                payment_status: 'pending',
                transaction_id: razorpayOrder.id, // Razorpay order ID
            });
        }

        // Send response
        res.status(201).json({
            message: 'Payment initiated successfully.',
            orderId: payment.transaction_id,
            paymentId: payment.id,
            amount,
            currency: 'GBP',
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Failed to initiate payment.' });
    }
};






exports.updatePaymentStatus = async (req, res) => {
    const { payment_id, appointment_id, razorpay_payment_id } = req.body;
  
    console.log("Request body:", req.body);
  
    if (!payment_id || !appointment_id || !razorpay_payment_id) {
      return res.status(400).json({ message: 'Payment ID, Appointment ID, and Razorpay Payment ID are required' });
    }
  
    try {
      const payment = await Payment.findByPk(payment_id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      const paymentMethod = paymentDetails.method; // Payment method (e.g., upi, netbanking, card)
      const appointment = await Appointment.findByPk(appointment_id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      payment.payment_status = 'completed';
      payment.payment_method = paymentMethod;
      await payment.save();
  
      appointment.status = 'completed';
      await appointment.save();
  
      return res.status(200).json({ message: 'Payment and Appointment status updated successfully' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      return res.status(500).json({ message: 'An error occurred while updating payment and appointment statuses' });
    }
  };
  



exports.failPaymentStatus = async(req,res) =>{
    const { payment_id } = req.body; // Expecting payment_id in the request body

  if (!payment_id) {
    return res.status(400).json({ message: 'Payment ID is required' });
  }

  try {
    // Find the Payment record by payment_id
    const payment = await Payment.findByPk(payment_id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update the payment status to 'failed'
    payment.payment_status = 'failed';
    await payment.save();

    // Send success response
    return res.status(200).json({ message: 'Payment status updated to failed successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating payment status' });
  }
};





exports.myPayments = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const payments = await Payment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Appointment,
          as: 'Appointment',
          attributes: ['id', 'appointment_date'], // Include only required fields
        },
      ],
      order: [['updatedAt', 'DESC']],  // Order payments by createdAt in descending order (most recent first)
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this user' });
    }

    return res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





exports.allPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: Appointment,
          as: 'Appointment',
          attributes: ['id', 'appointment_date'],
        },
      ],
      order: [['updatedAt', 'DESC']], // Order by updatedAt descending
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found' });
    }

    return res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

 
  



  exports.PaypalInit = async (req, res) => {
    const { appointment_id } = req.body;
    const { userId } = req.user;
  
    if (!appointment_id || !userId) {
      return res.status(404).json({ error: 'Appointment id or user id not found' });
    }
  
    console.log("userID", userId);
    try {
      const appointment = await Appointment.findByPk(appointment_id);
  
      if (!appointment || appointment.user_id !== userId) {
        return res.status(404).json({ error: 'Invalid appointment.' });
      }
  
      // Check if a payment already exists for this appointment
      let payment = await Payment.findOne({
        where: { appointment_id },
      });
  
      if (payment) {
        // Update the existing payment entry's updatedAt field
        payment.payment_status = 'pending'; // Reset to pending
        await payment.save(); // Save updates (automatically updates updatedAt)
      } else {
        // Create a new payment record
        payment = await Payment.create({
          user_id: userId,
          appointment_id,
          amount: 1.0,
          payment_status: 'pending',
        });
  
        if (!payment) {
          return res.status(404).json({ error: 'Payment cannot be created.' });
        }
      }
  
      // Create a PayPal order
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: payment.id.toString(),
            amount: {
              currency_code: 'GBP',
              value: '1.00',
            },
          },
        ],
        application_context: {
          return_url: `${process.env.REDIRECT_URI}/paypal/success`, // Backend success API
          cancel_url: `${process.env.REDIRECT_URI}/paypal/cancel?paymentId=${payment.id}`,
        },
      });
  
      const response = await client.execute(request);
  
      // Return PayPal approval URL
      const approvalUrl = response.result.links.find((link) => link.rel === 'approve')?.href;
  
      if (!approvalUrl) {
        return res.status(500).json({ error: 'Failed to generate PayPal approval URL' });
      }
  
      res.json({ approvalUrl });
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  };
  





exports.PaypalSuccess = async (req, res) => {
    const { token } = req.query;
  
    try {
      // Capture the PayPal payment
      const request = new paypal.orders.OrdersCaptureRequest(token);
      request.requestBody({});
      const capture = await client.execute(request);
  
      const paymentId = capture.result.purchase_units[0].reference_id; // Retrieve payment ID
      const paymentMethod = capture.result.payer.payment_method; // Extract payment method (e.g., card, PayPal balance, etc.)
      const transactionId = capture.result.id; // PayPal transaction ID
  
      // Update payment record
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
      // console.log("payment method",paymentMethod)
      // console.log(capture.result.payer)
      payment.payment_status = 'completed';
      payment.transaction_id = transactionId;
      payment.payment_method = paymentMethod || 'PayPal'; // Default to 'PayPal' if no method is provided
      await payment.save();
  
      // Update appointment status
      const appointment = await Appointment.findByPk(payment.appointment_id);

      if (appointment) {
        appointment.status = 'completed';
        await appointment.save();
      }
      else{
        return res.status(404).json({ error: 'Appointment record not found' });
      }
  
      res.json({ success: true, message: 'Payment successful' });
    } catch (error) {
      console.error('Error capturing payment:', error);
      res.status(500).json({ error: 'Failed to capture payment' });
    }
  };





exports.PaypalCancel = async (req, res) => {
    const { paymentId } = req.query;
  
    try {
      const payment = await Payment.findByPk(paymentId);
  
      if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
      }
      console.log("called cancel")
      payment.payment_status = 'failed';
      await payment.save();
  
      res.json({ success: false, message: 'Payment cancelled or failed.' });
    } catch (error) {
      console.error('Error handling payment cancellation:', error);
      res.status(500).json({ error: 'Failed to update payment status.' });
    }
  };
  
  // Initialize Stripe Payment
exports.initStripe = async (req, res) => {
    const { appointment_id } = req.body;
    const { userId } = req.user;
  
    if (!appointment_id || !userId) {
      return res.status(400).json({ error: 'Appointment ID and User ID are required.' });
    }
  
    try {
      const appointment = await Appointment.findByPk(appointment_id);
  
      if (!appointment || appointment.user_id !== userId) {
        return res.status(404).json({ error: 'Invalid appointment.' });
      }
  
      // Check if a payment record already exists for this appointment
      let payment = await Payment.findOne({ where: { appointment_id } });
  
      if (!payment) {
        // Create a new payment record
        payment = await Payment.create({
          user_id: userId,
          appointment_id,
          amount: 1.0,
          payment_status: 'pending',
        });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'klarna'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `Appointment #${appointment_id}`,
              },
              unit_amount: 100, // Amount in pence (0.5 GBP)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.REDIRECT_URI}/stripe/success?paymentId=${payment.id}`,
        cancel_url: `${process.env.REDIRECT_URI}/stripe/cancel?paymentId=${payment.id}`,
      });
  
      // Save the session ID (transaction ID) to the payment record
      payment.transaction_id = session.id;
      await payment.save();
  
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error initiating Stripe payment:', error);
      res.status(500).json({ error: 'Failed to initiate payment.' });
    }
  };
  

// Stripe Payment Success
exports.stripeSuccess = async (req, res) => {
  const { paymentId } = req.query;

  try {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    // Retrieve session details from Stripe using the transaction_id
    const session = await stripe.checkout.sessions.retrieve(payment.transaction_id);

    // Update payment record with payment status and method
    payment.payment_status = 'completed';
    payment.payment_method = session.payment_method_types?.[0] || 'Unknown';
    await payment.save();

    // Update the associated appointment status
    const appointment = await Appointment.findByPk(payment.appointment_id);
    if (appointment) {
      appointment.status = 'completed';
      await appointment.save();
    }

    res.json({ success: true, message: 'Payment successful' });
  } catch (error) {
    console.error('Error handling Stripe success:', error);
    res.status(500).json({ error: 'Failed to update payment status.' });
  }
};

// Stripe Payment Cancellation
exports.stripeCancel = async (req, res) => {
  const { paymentId } = req.query;

  try {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    payment.payment_status = 'failed';
    await payment.save();

    res.json({ success: false, message: 'Payment cancelled or failed.' });
  } catch (error) {
    console.error('Error handling Stripe cancellation:', error);
    res.status(500).json({ error: 'Failed to update payment status.' });
  }
};