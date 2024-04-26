import express from 'express';
import { EmployeeTaskController } from '../controllers/employee-task.controller';
import { checkAuthToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/:employeeId/tasks', checkAuthToken, EmployeeTaskController.getTasksByEmployeeId);

export { router as EmployeeTaskRouter };
