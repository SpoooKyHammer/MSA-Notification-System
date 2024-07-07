const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification System APIs',
      version: '1.0.0',
      description: 'Services for notification system.',
    },
    servers: [
      {
        url: 'http://spookyhammer.me/api',
        description: 'Production server',
      }, 
      {
        url: 'http://localhost:4000/api',
        description: 'Development server'
      },
    ],
  },
  apis: ['./auth-service/router/*.js', './notification-service/router/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
