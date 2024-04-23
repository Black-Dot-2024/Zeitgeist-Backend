import { Request, Response } from 'express';
import { z } from 'zod';
import { EmployeeTaskService } from '../../core/app/services/employee-task.services';

const getTasksByEmployeeIdSchema = z.object({
  userId: z.string(),
});

/**
 * Gets all the tasks associated with an employee.
 *
 * @param req: Request - Request object.
 * @param res: Response - Response object.
 *
 * @return {Promise<Response>} - Response object.
 */
async function getTasksByEmployeeId(req: Request, res: Response) {
  const { userId } = getTasksByEmployeeIdSchema.parse(req.body);

  try {
    const tasks = await EmployeeTaskService.getTasksByEmployeeId(userId);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const EmployeeTaskController = { getTasksByEmployeeId };
