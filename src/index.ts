import { PrismaClient } from '@prisma/client';
import express, { Express } from 'express';
import swaggerJSDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { baseRouter } from './api/routes/index.routes';
import { swaggerOptions } from './config/swagger-api.config';
import { EnvConfigKeys } from './utils/constants';

export const Prisma: PrismaClient = new PrismaClient(); // Instancia de Prisma Client, uso global
const app: Express = express();

const HOST: string = process.env[EnvConfigKeys.HOST] || 'localhost';
const PORT: number = process.env[EnvConfigKeys.PORT] ? parseInt(process.env[EnvConfigKeys.PORT]) : 6000;

app.use(express.json());
app.use(baseRouter);

const swaggerSpec = swaggerJSDoc(swaggerOptions as OAS3Options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger Docs available on http://${HOST}:${PORT}/docs`);
});
