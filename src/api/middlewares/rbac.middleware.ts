import { NextFunction, Request, Response } from 'express';
import { EmployeeService } from '../../core/app/services/employee.service';
import { SupportedRoles } from '../../utils/enums';

/**
 * Checks in the DB the role of the user
 * @param req
 * @param res
 * @param allowedRoles
 * @returns
 */
async function checkRole(req: Request, res: Response, allowedRoles: SupportedRoles[]) {
  const role = await EmployeeService.findRoleByEmail(req.body.auth.email);
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: 'User is not authorized' });
  }
}

/**
 * Middleware to check if the user has the role to access the route
 * @param allowedRoles
 * @returns Middleware
 */
export const checkAuthRole = (allowedRoles: SupportedRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await checkRole(req, res, allowedRoles);
    next();
  };
};
