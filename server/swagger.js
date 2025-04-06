const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Music Pearls API',
      version: '1.0.0',
      description: 'API for exploring classical music composers and their works',
    },
    servers: [
      {
        url: 'http://localhost:8888',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './app.js'], // paths to files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerSetup; 