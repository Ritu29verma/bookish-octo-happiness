require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const setupSwagger = require('./config/swagger');
const sequelize = require('./config/dbConfig'); 
const User = require('./models/User');
const Appointment = require('./models/Appointment');

User.setAssociations({ Appointment });
Appointment.setAssociations({ User });

(async () => {
    try {
      // Synchronize the database
      await sequelize.sync({ alter: true }); // `alter` will update the table without deleting existing data
      console.log('Database synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing the database:', error);
    }
  })();

const app = express();
app.use(cors({ origin: '*' })); 
// app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' })); // Allow specific origins or all (*)

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

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
