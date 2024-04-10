import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';

const router = Router();

/**
 * @openapi
 * /roles/create:
 *   post:
 *     summary: Creates a new role
 *     tags:
 *       - Roles
 *     description: Verifies the new role ID to ensure it is unique, then creates the role in the database with the provided payload.
 */
router.post('/create', RoleController.createRole);

export const RoleRouter = router;
