import { Router } from 'express';
import { updateUserRole } from '../controllers/admin.controller';

const router = Router();

router.put('/role', updateUserRole);

export { router as AdminRouter };
