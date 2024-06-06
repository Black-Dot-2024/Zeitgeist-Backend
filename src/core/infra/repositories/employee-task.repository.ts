import { EmployeeTask } from '../../domain/entities/employee-task.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapEmployeeTaskEntityFromDbModel } from '../mappers/employee-task-entity-from-db-model-mapper';
import { Prisma } from '../providers/prisma.provider';

const RESOURCE_NAME = 'EmployeeTask';

async function findAll(): Promise<EmployeeTask[]> {
  try {
    const data = await Prisma.employee_task.findMany();

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapEmployeeTaskEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Creates a new employee task in the database.
 *
 * @param newEmployeeTask: EmployeeTask - New employee task to be created.
 * @returns {Promise<EmployeeTask>} - Created employee task.
 *
 * @throws {Error} - If an error occurs when creating the employee task.
 */
async function create(newEmployeeTask: EmployeeTask): Promise<EmployeeTask | null> {
  return await Prisma.$transaction(async (prisma: any) => {
    try {
      const createdEmployeeTask = await prisma.employee_task.create({
        data: {
          id: newEmployeeTask.id,
          created_at: newEmployeeTask.createdAt || new Date(),
          id_employee: newEmployeeTask.idEmployee,
          id_task: newEmployeeTask.idTask,
        },
      });

      return mapEmployeeTaskEntityFromDbModel(createdEmployeeTask);
    } catch (error: unknown) {
      throw new Error(`Failed to create employee task on ${RESOURCE_NAME}`);
    }
  });
}

/**
 * Finds an array of tasks assigned to an employee based off an array
 * of task IDs.
 *
 * @param taskIds: string[] - Array of task IDs.
 * @returns {Promise<EmployeeTask[]>} - List of employee tasks.
 *
 * @throws {Error} - If an error occurs when finding the employee task.
 */
async function findByTaskIds(taskIds: string[]): Promise<EmployeeTask[]> {
  try {
    const data = await Prisma.employee_task.findMany({
      where: {
        id_task: {
          in: taskIds,
        },
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapEmployeeTaskEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Finds an employee task object by the employee ID.
 *
 * @param employeeId: string - Unique identifier of the employee.
 * @return {Promise<EmployeeTask[]>} - List of employee tasks.
 *
 * @throws {Error} - If an error occurs when finding the employee task.
 */
async function findByEmployeeId(employeeId: string): Promise<EmployeeTask[]> {
  try {
    const data = await Prisma.employee_task.findMany({
      where: {
        id_employee: employeeId,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapEmployeeTaskEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Deletes an employee task object by the task ID
 *
 * @param taskId: string - Unique identifier of the task.
 * @return {Promise<void>} - If the employee task is deleted.
 *
 * @throws {Error} - If an error occurs when deleting the employee task.
 */
async function deleteByTaskId(taskId: string): Promise<void> {
  try {
    await Prisma.employee_task.deleteMany({
      where: {
        id_task: taskId,
      },
    });
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Validates that a task is not already assigned to an employee.
 *
 * @param employeeId: string - The employee ID.
 * @param taskId: string - The task ID.
 *
 * @returns {Promise<boolean>} - True if the task is assigned to the employee, false otherwise.
 */
async function validateEmployeeTask(taskId: string): Promise<boolean> {
  try {
    const data = await Prisma.employee_task.findFirst({
      where: {
        id_task: taskId,
      },
    });

    return !!data;
  } catch (error: unknown) {
    throw new Error(`Failed to validate employee task on ${RESOURCE_NAME}`);
  }
}

export const EmployeeTaskRepository = {
  findAll,
  create,
  findByEmployeeId,
  deleteByTaskId,
  validateEmployeeTask,
  findByTaskIds,
};
