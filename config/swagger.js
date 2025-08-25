const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description:
        'A feature-rich RESTful API for a modern blogging platform with authentication, posts, and comments.',
    },
    servers: [
      {
        url:
          process.env.SWAGGER_SERVER_URL ||
          'https://blog-api-3pxs.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['routes/*.js', 'controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
