import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import 'dotenv/config';
import express, { Express } from 'express';
import { baseRouter } from './api/routes/index.routes';
import { EnvConfigKeys } from './utils/constants';
import { logger } from './utils/logger';

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

app.use(logger);
app.use(baseRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
