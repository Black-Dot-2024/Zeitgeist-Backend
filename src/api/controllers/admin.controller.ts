import { Request, Response } from 'express';
import { z } from 'zod';
import { updateUserRole as updateUserRoleService } from '../../core/app/services/admin-role.service';

// Defines a schema for validations
const updateUserRoleSchema = z.object({
  userId: z.string().min(1, { message: 'User ID cannot be empty' }),
  roleId: z.string().min(1, { message: 'Role ID cannot be empty' }),
});

// Updates a user's role
async function updateUserRole(req: Request, res: Response) {
  try {
    const { userId, roleId } = updateUserRoleSchema.parse(req.body);

    const employee = await updateUserRoleService(userId, roleId);
    res.status(200).json({ data: employee });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
}

export { updateUserRole as updateUserRole };
