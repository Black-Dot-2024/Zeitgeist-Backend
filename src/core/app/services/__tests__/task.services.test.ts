import { expect } from 'chai';
import { randomUUID } from 'crypto';
import { instance, mock, resetCalls, when } from 'ts-mockito';
import { TaskStatus } from '../../../../utils/enums';
import { TaskRepository } from '../../../infra/repositories/tasks.repository';
import { Task } from '../../interfaces/project-report.interface';
import { TaskService } from '../task.services';

describe('TaskService', () => {
  let taskService: typeof TaskService;
  let taskRepositoryMock: typeof TaskRepository;
  let taskRepositoryInstance: typeof TaskRepository;

  beforeEach(() => {
    taskRepositoryMock = mock<typeof TaskRepository>();
    taskRepositoryInstance = instance(taskRepositoryMock);
    taskService = {
      ...TaskService,
      createTask: (newTask: Task) => taskRepositoryInstance.createTask(newTask),
    };
  });

  afterEach(() => {
    resetCalls(taskRepositoryMock);
  });

  describe('createTask', () => {
    it('Should create a new task with the given data', async () => {
      const newTask: Task = {
        id: randomUUID(),
        title: 'SAT Verification for ABC Company',
        description: 'Verify the SAT information for the ABC Company',
        status: TaskStatus.IN_PROGRESS,
        waitingFor: 'John Doe',
        startDate: new Date(),
        workedHours: 20,
        createdAt: new Date(),
        idProject: randomUUID(),
      };

      when(taskRepositoryMock.createTask(newTask)).thenResolve(newTask);
      const createdTask = await taskService.createTask(newTask);

      expect(createdTask).to.deep.equal(newTask);
    });

    it('Should throw an error if the task creation fails', async () => {
      const newTask: Task = {
        id: randomUUID(),
        title: 'SAT Verification for ABC Company',
        description: 'Verify the SAT information for the ABC Company',
        status: TaskStatus.IN_PROGRESS,
        waitingFor: 'John Doe',
        startDate: new Date(),
        workedHours: 20,
        createdAt: new Date(),
        idProject: randomUUID(),
      };

      when(taskRepositoryMock.createTask(newTask)).thenThrow(new Error('Failed to create task'));

      try {
        await taskService.createTask(newTask);
      } catch (error: unknown) {
        expect(error).to.be.an('Error');
        expect((error as Error).message).to.equal('Failed to create task');
      }
    });

    it('Should return null if the task already exists', async () => {
      const newTask: Task = {
        id: randomUUID(),
        title: 'SAT Verification for ABC Company',
        description: 'Verify the SAT information for the ABC Company',
        status: TaskStatus.IN_PROGRESS,
        waitingFor: 'John Doe',
        startDate: new Date(),
        workedHours: 20,
        createdAt: new Date(),
        idProject: randomUUID(),
      };

      when(taskRepositoryMock.createTask(newTask)).thenResolve(null);
      const createdTask = await taskService.createTask(newTask);

      expect(createdTask).to.be.null;
    });
  });
});