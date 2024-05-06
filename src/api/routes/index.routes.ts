import { Router } from 'express';
import { checkAuthToken } from '../middlewares/auth.middleware';
import { AdminRouter } from './admin.routes';
import { CompanyRouter } from './company.routes';
import { EmployeeRouter } from './employee.routes';
import { NotificationRouter } from './notification.routes';
import { ProjectRouter } from './project.routes';
import { TaskRouter } from './task.routes';

const baseRouter = Router();

const V1_PATH = '/api/v1';

baseRouter.use(checkAuthToken);

//Auth
baseRouter.use(`${V1_PATH}/admin`, AdminRouter);

// Employee
baseRouter.use(`${V1_PATH}/employee`, EmployeeRouter);

//Project
baseRouter.use(`${V1_PATH}/project`, ProjectRouter);

// Tasks
baseRouter.use(`${V1_PATH}/tasks`, TaskRouter);

//Company
baseRouter.use(`${V1_PATH}/company`, CompanyRouter);

// Notification
baseRouter.use(`${V1_PATH}/notification`, NotificationRouter);

// Health check
baseRouter.use(`${V1_PATH}/health`, (_req, res) => res.send('OK'));

export { baseRouter };
