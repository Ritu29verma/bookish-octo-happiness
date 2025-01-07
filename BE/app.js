require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const setupSwagger = require('./config/swagger');
const sequelize = require('./config/dbConfig'); 
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Payment = require('./models/Payment');
const contactRoutes = require('./routes/contactRoutes');

User.setAssociations({ Appointment });
Appointment.setAssociations({ User });
Payment.setAssociations({ User, Appointment });

(async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing the database:', error);
    }
  })();

const app = express();
app.use(cors({ origin: '*' })); 
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true // Enable credentials for secure requests
// }));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/api', contactRoutes);

// Swagger
setupSwagger(app);

// Default 404
app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

const PORT = process.env.PORT || 3000; // Use PORT from .env if defined
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
