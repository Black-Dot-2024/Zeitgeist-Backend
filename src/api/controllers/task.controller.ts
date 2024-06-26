import { Request, Response } from 'express';
import { z } from 'zod';
import { TaskService } from '../../core/app/services/task.service';
import { BareboneTask, UpdatedTask } from '../../core/domain/entities/task.entity';
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
    .max(256, {
      message: 'Description must have at most 255 characters',
    }),
  status: taskStatusSchema,
  startDate: z.coerce.date({ required_error: 'Start date is required' }),
  endDate: z.coerce.date().nullable(),
  workedHours: z.number(),
  idEmployee: z.string().uuid({ message: 'Invalid UUID format' }).nullable(),
  idProject: z.string().uuid({ message: 'Invalid UUID format' }),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

const idProjectSchema = z.object({
  idProject: z.string().uuid({ message: 'Invalid UUID format' }),
});

/**
 * Validates the data received through the POST method
 *
 * @param data:
 * @returns
 */
function validateTaskData(data: BareboneTask) {
  const bodyTask = taskSchema.parse(data);

  return {
    ...bodyTask,
    status: data.status as TaskStatus,
    workedHours: Number(bodyTask.workedHours) || 0.0,
    endDate: bodyTask.endDate || null,
    idEmployee: bodyTask.idEmployee,
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
    const validatedTaskData = validateTaskData(req.body);
    const payloadTask = await TaskService.createTask(validatedTaskData, req.body.auth.email);

    if (!payloadTask) {
      return res.status(409).json({ message: 'Task already exists' });
    }

    res.status(201).json(payloadTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Sends a request to the service to fetch an array of tasks form a unique project.
 *
 * @param req: Request - The request object.
 * @param res: Response - The response object.
 * @returns res.status(200).json(tasks) - The array of tasks.
 * Sends a request to the service to create a new task with the given data.
 * @throws 500 - If an error occurs.
 */

async function getTasksFromProject(req: Request, res: Response) {
  try {
    const { idProject } = idProjectSchema.parse({ idProject: req.params.idProject });
    const data = await TaskService.getTasksFromProject(idProject, req.body.auth.email);
    res.status(200).json({ data });
  } catch (error: any) {
    if (error.message === 'Unauthorized employee') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

async function findTaskById(req: Request, res: Response) {
  try {
    const { id } = idSchema.parse({ id: req.params.id });

    const data = await TaskService.findUnique(id, req.body.auth.email);
    res.status(200).json(data);
  } catch (error: any) {
    if (error.message === 'Unauthorized employee') {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

/**
 * Get all tasks from a unique project from the db.
 *
 * @param req: Request - The request object.
 * @param res: Response - The response object.
 *
 * @returns {res.status(200).json(data)} - Array of tasks.
 * @throws {res.status(500).json({ message })} - If an error occurs when
 *                                               getting array of tasks.
 */
async function findTasksByEmployeeId(req: Request, res: Response) {
  try {
    const { id } = idSchema.parse({ id: req.params.idEmployee });
    const data = await TaskService.getTasksAssignedToEmployee(id);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Deletes a task using the repository.
 *
 * @param req: Request - The request object.
 * @param res: Response - The response object.
 *
 * @returns {res.status(204)} - If the task is deleted.
 * @throws {res.status(500).json({ message })} - If an error occurs when
 *                                               deleting the task.
 */
async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = idSchema.parse({ id: req.params.id });
    await TaskService.deleteTask(id);

    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Validates the data using zod schema
 *
 * @brief This is a zod schema that validates the data of an updated task
 */
const updatedTaskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(70).optional(),
  description: z.string().min(1).max(256).optional(),
  status: taskStatusSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  workedHours: z.number().optional().nullable(),
  idProject: z.string().optional(),
  idEmployee: z.string().optional().nullable(),
});

/**
 * @brief Validates the data received through the PUT method
 *
 * @param idTask: string - The task id.
 * @param data: UpdatedTask - The data to be validated.
 *
 * @returns {id: string, ...bodyTask, status: TaskStatus, workedHours: number}
 */
function validateUpdatedTaskData(idTask: string, data: UpdatedTask) {
  const bodyTask = updatedTaskSchema.parse(data);
  const status = data.status as TaskStatus;

  return {
    id: idTask,
    ...bodyTask,
    status: status,
    workedHours: Number(bodyTask.workedHours) || 0.0,
  };
}

/**
 * @brief Sends a request to the service to update a task with the given data.
 *
 * @param req: Request - The request object.
 * @param res: Response - The response object.
 * @returns res.status(200).json("Task updated successfully") - The updated task.
 *
 * @throws 500 - If an error occurs.
 */
async function updateTask(req: Request, res: Response) {
  try {
    const idTask = req.params.id;

    const validatedTaskData = validateUpdatedTaskData(idTask, req.body);
    const data = await TaskService.updateTask(idTask, {
      ...validatedTaskData,
      idEmployee: validatedTaskData.idEmployee,
    });

    if (!data) {
      return res.status(500).json({ message: 'An error occured while updating Task' });
    }

    res.status(200).json('Task updated successfully');
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * @brief Sends a request to the service to update a task status with the given data.
 *
 * @param req: Request - The request object.
 * @param res: Response - The response object.
 * @returns res.status(200).json("Task updated successfully") - The updated task.
 *
 * @throws 500 - If an error occurs.
 */
async function updateTaskStatus(req: Request, res: Response) {
  try {
    const status = z.nativeEnum(TaskStatus).parse(req.body.status);
    const { id } = req.params;
    const data = await TaskService.updateTaskStatus(id, status);

    if (!data) {
      return res.status(500).json({ message: 'An error occured while updating Task' });
    }

    res.status(200).json('Task status updated successfully');
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const TaskController = {
  createTask,
  getTasksFromProject,
  findTaskById,
  updateTask,
  findTasksByEmployeeId,
  deleteTask,
  updateTaskStatus,
};
