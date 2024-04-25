import { Request, Response } from 'express';
import { z } from 'zod';
import { TaskService } from '../../core/app/services/task.service';

const getTasksByEmployeeIdSchema = z.object({
  employeeId: z.string(),
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
  const { employeeId } = req.params;

  try {
    getTasksByEmployeeIdSchema.parse({ employeeId });
    const tasks = await TaskService.findTasksByEmployeeId(employeeId);

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid employeeId' });
  }
}

export const EmployeeTaskController = { getTasksByEmployeeId };
