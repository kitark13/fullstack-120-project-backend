import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travelers API',
      version: '1.0.0',
      description: 'API documentation for Travelers project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // де описані routes
};

export const swaggerSpec = swaggerJSDoc(options);
