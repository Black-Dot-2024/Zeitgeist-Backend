import { EmployeeTask } from '../../domain/entities/employee-task.entity';
import { EmployeeTaskRepository } from '../../infra/repositories/employee-task.repository';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';

/**
 * Finds all the tasks associated with an employee.
 *
 * @param userId: string - Employee identifier.
 * @returns {Promise<EmployeeTask[]>} - List of tasks associated
 *                                      with the employee.
 *
 * @throws {Error} - If an error occurs when finding the tasks.
 */
async function getTasksByEmployeeId(userId: string): Promise<EmployeeTask[]> {
  try {
    const existingEmployee = await EmployeeRepository.findById(userId);

    if (!existingEmployee) {
      throw new Error(`Employee does not exist`);
    }

    const tasks = await EmployeeTaskRepository.getTasksByEmployeeId(userId);
    return tasks;
  } catch (error: unknown) {
    throw new Error(`There was an error getting the tasks for the employee with id ${userId}`);
  }
}

export const EmployeeTaskService = { getTasksByEmployeeId };
