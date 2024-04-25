import { Prisma } from '../../..';
import { EmployeeTask } from '../../domain/entities/employee-task.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapEmployeeTaskEntityFromDbModel } from '../mappers/employee-task-entity-from-db-model-mapper';

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
 * Finds the tasks related to an employee
 *
 * @param idEmployee: string - The id of the employee to find the tasks
 * @return {Promise<EmployeeTask[]>} - Array of tasks found.
 */
async function findTasksByEmployeeId(idEmployee: string): Promise<EmployeeTask[]> {
  try {
    const data = await Prisma.employee_task.findMany({
      where: {
        id_employee: idEmployee,
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

export const EmployeeTaskRepository = { findAll, findTasksByEmployeeId };
