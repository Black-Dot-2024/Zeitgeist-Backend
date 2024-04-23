import { Prisma } from '../../..';
import { EmployeeTask } from '../../domain/entities/employee-task.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapEmployeeTaskEntityFromDbModel } from '../mappers/employee-task-entity-from-db-model-mapper';

const RESOURCE_NAME = 'EmployeeTask';

async function findAll(): Promise<EmployeeTask[]> {
  try {
    let data = await Prisma.employee_task.findMany();

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapEmployeeTaskEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Finds all the tasks associated with an employee.
 *
 * @param userId: string - Employee identifier.
 * @returns {Promise<EmployeeTask[]>} - List of tasks associated
 *                                      with the employee.
 *
 * @throws {Error} - If an error occurs when finding the tasks.
 * @throws {NotFoundError} - If no tasks are found.
 */
async function getTasksByEmployeeId(userId: string): Promise<EmployeeTask[]> {
  try {
    let userTasks = await Prisma.employee_task.findMany({
      where: { id_employee: userId },
      include: { task: true },
    });

    if (!userTasks) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return userTasks.map(mapEmployeeTaskEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

export const EmployeeTaskRepository = { findAll, getTasksByEmployeeId };
