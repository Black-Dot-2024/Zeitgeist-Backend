import { Request, Response } from 'express';
import { z } from 'zod';
import { TaskService } from '../../core/app/services/task.service';
import { BareboneTask } from '../../core/domain/entities/task.entity';
import { TaskStatus } from '../../utils/enums';

const taskStatusSchema = z.enum([
  TaskStatus.NOT_STARTED,
  TaskStatus.IN_PROGRESS,
  TaskStatus.UNDER_REVISSION,
  TaskStatus.DELAYED,
  TaskStatus.POSTPONED,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
  TaskStatus.DEFAULT,
]);

const taskSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title must have at least 1 character',
    })
    .max(70, {
      message: 'Title must have at most 70 characters',
    }),
  description: z
    .string()
    .min(1, {
      message: 'Description must have at least 1 character',
    })
    .max(255, {
      message: 'Description must have at most 255 characters',
    }),
  status: taskStatusSchema,
  waitingFor: z
    .string()
    .min(1, {
      message: 'Waiting for must have at least 1 character',
    })
    .max(70, {
      message: 'Waiting for must have at most 70 characters',
    }),
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  dueDate: z.coerce.date({ required_error: 'Due date is required' }),
  workedHours: z.string().optional(),
  idProject: z.string().uuid({ message: 'Invalid UUID format' }),
  idEmployee: z.string().uuid({ message: 'Invalid UUID format' }),
});

/**
 * Validates the data received through the POST method
 *
 * @param data:
 * @returns
 */
function validateTaskDate(data: BareboneTask) {
  const bodyTask = taskSchema.parse(data);
  const status = data.status as TaskStatus;

  return {
    ...bodyTask,
    status: status,
    workedHours: Number(bodyTask.workedHours) || 0.0,
    dueDate: bodyTask.dueDate,
    employeeId: bodyTask.idEmployee,
  };
}

/**
 * Sends a request to the service to create a new task with the given data.
 *
 * @param req: Request - The request object.
 * @param res: Response - The response object.
 * @returns res.status(201).json(createdTask) - The created task.
 * @returns res.status(409).json({ message }) - If the task already exists.
 * @returns res.status(500).json({ message }) - If an error occurs.
 *
 * @throws 500 - If an error occurs.
 */
async function createTask(req: Request, res: Response) {
  try {
    const validateTaskData = validateTaskDate(req.body);
    const payloadTask = await TaskService.createTask(validateTaskData);

    if (!payloadTask) {
      return res.status(409).json({ message: 'Task already exists' });
    }

    res.status(201).json(payloadTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const TaskController = { createTask };
