require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Barber Booking API',
      version: '1.0.0',
      description: 'API documentation for the Barber Booking System',
    },
    servers: [{ url: process.env.SERVER_URL }],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
