import { Router } from 'express';
import { SupportedRoles } from '../../utils/enums';
import { updateUserRole } from '../controllers/admin.controller';
import { checkAuthToken } from '../middlewares/auth.middleware';
import { checkAuthRole } from '../middlewares/rbac.middleware';

const router = Router();

router.put('/role', checkAuthToken, checkAuthRole([SupportedRoles.ADMIN]), updateUserRole);

export { router as AdminRouter };
