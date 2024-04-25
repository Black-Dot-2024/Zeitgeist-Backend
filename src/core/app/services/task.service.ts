import { randomUUID } from 'crypto';
import { BareboneTask, Task } from '../../domain/entities/task.entity';
import { EmployeeTaskRepository } from '../../infra/repositories/employee-task.repository';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';
import { ProjectRepository } from '../../infra/repositories/project.repository';
import { TaskRepository } from '../../infra/repositories/tasks.repository';

/**
 * Creates a new task using the repository.
 *
 * @param newTask: Task - New task to be created.
 * @returns {Promise<Task | null>} - Created task or null if it already exists.
 *
 * @throws {Error} - If an error occurs when creating the task.
 */
async function createTask(newTask: BareboneTask): Promise<Task | null> {
  try {
    if ((await ProjectRepository.findById(newTask.idProject)) === null) {
      throw new Error('Project ID is not valid');
    }

    const task: Task = {
      id: randomUUID(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      waitingFor: newTask.waitingFor,
      startDate: newTask.startDate,
      endDate: newTask.dueDate ?? undefined,
      workedHours: newTask.workedHours ?? undefined,
      createdAt: new Date(),
      idProject: newTask.idProject,
    };

    return await TaskRepository.createTask(task);
  } catch (error: unknown) {
    throw new Error('Error creating task');
  }
}

/**
 * Finds the tasks related to an employee
 *
 * @param employeeId: string - The id of the employee to find the tasks
 * @return {Promise<Task[]>} - Array of tasks found.
 *
 * @throws {Error} - If an error occurs when fetching the tasks.
 */
async function findTasksByEmployeeId(employeeId: string): Promise<Task[]> {
  try {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    const relatedTasks = await EmployeeTaskRepository.findTasksByEmployeeId(employeeId);

    const taskIds = relatedTasks.map(task => task.idTask);
    if (taskIds.length === 0) return [];

    return await TaskRepository.findTasksByIds(taskIds);
  } catch (error: unknown) {
    throw new Error(`Error finding the related tasks for employee`);
  }
}

export const TaskService = { createTask, findTasksByEmployeeId };
