export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkBridge API',
      version: '1.0.0',
      description: 'Esta es la documentación de la API de LinkBridge',
    },
  },
  apis: ['./src/api/routes/*.ts'],
};
