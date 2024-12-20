import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Swagger definition for API documentation
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Furry Lab Services API',
    version: '1.0.0',
    description: 'API documentation for The Furlab Project',
  },
  servers: [
    {
      url: 'http://localhost:3000',
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition: swaggerDefinition, // OpenAPI definition
  definition: swaggerDefinition, // OpenAPI definition
  apis: ['./**/**/routes/*.ts'], // Path to the API docs
};

// Initialize swagger-jsdoc -> returns validated swagger spec in JSON format
const swaggerSpec = swaggerJsdoc(options);

// Export swaggerUi and swaggerSpec for use in the main application
export { swaggerUi, swaggerSpec };
