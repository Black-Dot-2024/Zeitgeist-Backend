import { Router } from 'express';
import { EmployeeTaskRouter } from '../routes/employee-task.routes';
import { AdminRouter } from './admin.routes';
import { CompanyRouter } from './company.routes';
import { DummyRouter } from './dummy.routes';
import { EmployeeRouter } from './employee.routes';
import { ProjectRouter } from './project.routes';
import { TaskRouter } from './task.routes';

const baseRouter = Router();
const V1_PATH = '/api/v1';

baseRouter.use('/dummy', DummyRouter);

//Auth
baseRouter.use(`${V1_PATH}/admin`, AdminRouter);

// Employee
baseRouter.use(`${V1_PATH}/employee`, EmployeeRouter);

//Project
baseRouter.use(`${V1_PATH}/project`, ProjectRouter);

// Tasks
baseRouter.use(`${V1_PATH}/tasks`, TaskRouter);

// Employee Task
baseRouter.use(`${V1_PATH}/employee-task`, EmployeeTaskRouter);

//Company
baseRouter.use(`${V1_PATH}/company`, CompanyRouter);

// Health check
baseRouter.use(`${V1_PATH}/health`, (_req, res) => res.send('OK'));

export { baseRouter };
