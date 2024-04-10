import { Request, Response } from 'express';
import { RoleService } from '../../core/app/services/role.services';

/**
 * Sends a request to the service to create a new role with the provided data.
 *
 * @param req: Request - The request object
 * @param res: Response - The response object
 */
async function createRole(req: Request, res: Response) {
  try {
    const role = await RoleService.createRole(req.body);
    res.status(201).json({ role });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Sends a request to the service to delete a role based off the ID
 *
 * @param req: Request - The request object
 * @param res: Response - The response object
 */
async function deleteRole(req: Request, res: Response) {
  try {
    const role = await RoleService.deleteRole(req.body);
    res.status(201).json({ role });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const RoleController = { createRole, deleteRole };
