import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import swaggerJSDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { baseRouter } from './api/routes/index.routes';
import { swaggerOptions } from './config/swagger-api.config';
import { EnvConfigKeys } from './utils/constants';

export const Prisma: PrismaClient = new PrismaClient();
const app: Express = express();

const HOST: string = process.env[EnvConfigKeys.HOST] || 'localhost';
const PORT: number = process.env[EnvConfigKeys.PORT] ? parseInt(process.env[EnvConfigKeys.PORT]) : 4000;

const CLIENT_URL = process.env[EnvConfigKeys.CLIENT_URL];

app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  })
);

app.use(express.json());
app.use(baseRouter);

const swaggerSpec = swaggerJSDoc(swaggerOptions as OAS3Options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger Docs available on http://${HOST}:${PORT}/docs`);
});
