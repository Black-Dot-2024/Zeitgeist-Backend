import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

const router = Router();

router.post('/create', RoleController.createRole);

export const RoleRouter = router;
