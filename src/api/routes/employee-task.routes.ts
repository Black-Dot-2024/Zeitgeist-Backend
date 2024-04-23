import express from 'express';
import { EmployeeTaskController } from '../controllers/employee-task.controller';

const router = express.Router();

router.get('/:employeeId/tasks', EmployeeTaskController.getTasksByEmployeeId);

export { router as EmployeeTaskRouter };
