import { Request, Response } from 'express';
import * as z from 'zod';
import { EmployeeService } from '../../core/app/services/employee.service';
import { NotFoundError } from '../../core/errors/not-found.error';

const authSchema = z.object({
  auth: z.object({
    name: z.string(),
    email: z.string().email(),
    picture: z.string().url(),
  }),
});

async function userExists(req: Request, res: Response) {
  try {
    const parsed = authSchema.parse(req.body);

    const employee = await EmployeeService.signIn({
      fullName: parsed.auth.name,
      email: parsed.auth.email,
      imageUrl: parsed.auth.picture,
    });
    res.status(201).json({ data: employee });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: 'Employee not found for the provided email.' });
    } else {
      res.status(500).json({ message: 'Internal server error occurred.' });
    }
  }
}

/**
 * Controller to get all employees
 *
 * @param req
 * @param res
 */
async function getAllEmployees(req: Request, res: Response) {
  try {
    const employees = await EmployeeService.getAllEmployees();
    res.status(200).json({ data: employees });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error occurred.' });
  }
}

export const EmployeeController = { userExists, getAllEmployees };
