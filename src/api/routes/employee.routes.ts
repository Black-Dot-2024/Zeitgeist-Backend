import { Router } from 'express';
import { SupportedRoles } from '../../utils/enums';
import { EmployeeController } from '../controllers/employee.controller';
import { checkAuthToken } from '../middlewares/auth.middleware';
import { checkAuthRole } from '../middlewares/rbac.middleware';

const router = Router();

router.post('/signup', checkAuthToken, EmployeeController.userExists);
router.get('/', checkAuthToken, checkAuthRole([SupportedRoles.ADMIN]), EmployeeController.getAllEmployees);

export { router as EmployeeRouter };
