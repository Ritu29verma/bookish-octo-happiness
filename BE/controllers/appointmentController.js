require('dotenv').config(); 
const AWS = require('../config/awsConfig');
const User = require('../models/User'); // Import the User model
const Appointment = require('../models/Appointment')
const Notification = require('../models/Notification')

const ses = new AWS.SES();




const sendEmail = async (to, subject, body) => {
    const params = {
      Source: process.env.SES_SENDER_EMAIL,  // Your verified SES email
      Destination: {
        ToAddresses: [to], // Recipient's email
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    };
  
    try {
      const data = await ses.sendEmail(params).promise();
      return data; // Return data on success
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };
  
exports.book = async (req, res) => {
    const { username } = req.user;
    const { appointment_date } = req.body;
  
    if (!appointment_date) {
      return res.status(400).json({ message: 'Appointment date is required' });
    }
  
    try {
      // Find user by username
      const user = await User.findOne({ where: { username } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create the appointment
      const appointment = await Appointment.create({
        user_id: user.id,
        appointment_date,
      });
  
      // Prepare notification message
      const message = `Hello ${user.username}, your appointment is scheduled for ${appointment_date}.`;
  
      // Send notification to user
      await sendEmail(user.email, 'Appointment Confirmation', message);
  
      // Prepare message for the barber shop owner
      const barberShopOwnerEmail = process.env.BARBER_SHOP_OWNER_EMAIL; // Ensure you set this in .env file
      const ownerMessage = `New appointment booked: ${user.username} has scheduled an appointment for ${appointment_date}.`;
  
      // Send notification to the barber shop owner
      await sendEmail(barberShopOwnerEmail, 'New Appointment Booking', ownerMessage);
  
      // Save the notifications in the database (Notification model)
      await Notification.create({
        user_id: user.id,
        message,
        status: 'sent',
      });
  
      return res.status(201).json({
        message: 'Appointment booked successfully and notifications sent',
        appointment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };




  exports.allappointments = async (req, res) => {
    try {
      const appointments = await Appointment.findAll({
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['username', 'email'], // Include only necessary fields
          },
        ],
        order: [['createdAt', 'DESC']], // Sort by creation date (most recent first)
      });
  
      const formattedAppointments = appointments.map((appointment) => ({
        id: appointment.id,
        appointmentDate: appointment.appointment_date,
        createdAt: appointment.createdAt,
        status: appointment.status,
        CustomerName: appointment.User.username,
        CustomerEmail: appointment.User.email,
      }));
  
      res.json(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments.' });
    }
  };
  
  


  exports.confirm = async (req, res) => {
    const { id } = req.body; // Extract appointment ID from the request body
    try {
      // Find the appointment and include the associated User
      const appointment = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['username', 'email'], // Include only necessary fields
          },
        ],
      });
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
  
      // Update the appointment status to "confirmed"
      appointment.status = 'confirmed';
      await appointment.save();
  
      // Send email to the customer
      const customerMessage = `Hello ${appointment.User.username}, your appointment scheduled for ${appointment.appointment_date} has been confirmed.`;
      await sendEmail(appointment.User.email, 'Appointment Confirmed', customerMessage);
  
      // Create notification for the customer
      await Notification.create({
        user_id: appointment.user_id,
        message: customerMessage,
        status: 'sent',
      });
  
      // Send email to the barber shop owner
      const ownerMessage = `Appointment confirmed: ${appointment.User.username} has an appointment scheduled for ${appointment.appointment_date}.`;
      const barberShopOwnerEmail = process.env.BARBER_SHOP_OWNER_EMAIL;
      await sendEmail(barberShopOwnerEmail, 'Appointment Confirmed', ownerMessage);
  
      res.status(200).json({ message: 'Appointment confirmed successfully and emails sent.' });
    } catch (error) {
      console.error('Error confirming appointment:', error);
      res.status(500).json({ message: 'Failed to confirm appointment.' });
    }
  };
  
  exports.reject = async (req, res) => {
    const { id } = req.body; // Extract appointment ID from the request body
    try {
      // Find the appointment and include the associated User
      const appointment = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['username', 'email'], // Include only necessary fields
          },
        ],
      });
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
  
      // Update the appointment status to "cancelled"
      appointment.status = 'cancelled';
      await appointment.save();
  
      // Send email to the customer
      const customerMessage = `Hello ${appointment.User.username}, your appointment scheduled for ${appointment.appointment_date} has been cancelled.`;
      await sendEmail(appointment.User.email, 'Appointment Cancelled', customerMessage);
  
      // Create notification for the customer
      await Notification.create({
        user_id: appointment.user_id,
        message: customerMessage,
        status: 'sent',
      });
  
      // Send email to the barber shop owner
      const ownerMessage = `Appointment cancelled: ${appointment.User.username} had an appointment scheduled for ${appointment.appointment_date}, which has been cancelled.`;
      const barberShopOwnerEmail = process.env.BARBER_SHOP_OWNER_EMAIL;
      await sendEmail(barberShopOwnerEmail, 'Appointment Cancelled', ownerMessage);
  
      res.status(200).json({ message: 'Appointment cancelled successfully and emails sent.' });
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      res.status(500).json({ message: 'Failed to reject appointment.' });
    }
  };
  
  
  
