import { expect } from 'chai';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { TaskStatus } from '../../../../utils/enums';
import { BareboneTask, Task } from '../../../domain/entities/task.entity';
import { ProjectRepository } from '../../../infra/repositories/project.repository';
import { TaskRepository } from '../../../infra/repositories/tasks.repository';
import { TaskService } from '../task.service';

describe('TaskService', () => {
  let taskRepositoryStub: sinon.SinonStub;
  let projectRepositoryStub: sinon.SinonStub;
  let taskFetchRepositoryStub: sinon.SinonStub;

  const projectID = randomUUID();

  const task: BareboneTask = {
    title: 'ABC Company Anual SAT Report',
    description: 'This is the anual SAT report for the ABC Company',
    status: TaskStatus.IN_PROGRESS,
    startDate: new Date('2022-01-01'),
    dueDate: new Date('2022-12-31'),
    waitingFor: 'Client',
    workedHours: 20,
    idProject: projectID,
  };

  const createdTask: Task = {
    id: randomUUID(),
    title: 'ABC Company Anual SAT Report',
    description: 'This is the anual SAT report for the ABC Company',
    status: TaskStatus.IN_PROGRESS,
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-12-31'),
    waitingFor: 'Client',
    workedHours: 20,
    createdAt: new Date(),
    idProject: projectID,
  };

  const existingTask: Task = {
    id: randomUUID(),
    title: 'Application form',
    description: 'Creating an application for a process',
    status: TaskStatus.DONE,
    startDate: new Date('1970-01-01'),
    createdAt: new Date(),
    idProject: '72bd0b52-1a6a-4fa4-beca-d9d24a721df1',
  };

  beforeEach(() => {
    taskRepositoryStub = sinon.stub(TaskRepository, 'createTask');
    projectRepositoryStub = sinon.stub(ProjectRepository, 'findById');
    taskFetchRepositoryStub = sinon.stub(TaskRepository, 'findTasksByProjectId');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createTask', () => {
    it('Should create missing attributes and send them to the repository', async () => {
      taskRepositoryStub.returns(createdTask);
      projectRepositoryStub.resolves({ id: projectID });

      const result = await TaskService.createTask(task);

      expect(result).to.deep.equal(createdTask);
      expect(taskRepositoryStub.calledOnce).to.be.true;
    });

    it('Should not create a new task if the project does not exist', async () => {
      projectRepositoryStub.resolves({});

      try {
        await TaskService.createTask(task);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Project does not exist');
      }
    });

    it('Should return null if the task already exists', async () => {
      taskRepositoryStub.returns(null);
      projectRepositoryStub.resolves({ id: projectID });

      const result = await TaskService.createTask(task);

      expect(result).to.be.null;
      expect(taskRepositoryStub.calledOnce).to.be.true;
    });

    it('Should throw an error if the task could not be created', async () => {
      taskRepositoryStub.withArgs(task).throws(new Error('Could not create task'));
      projectRepositoryStub.resolves({ id: projectID });

      try {
        await TaskService.createTask(task);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Could not create task');
      }
    });
  });

  describe('getTasksFromProject', () => {
    it('Should get an array of tasks from the repository', async () => {
      // taskFetchRepositoryStub.returns(existingTask);
      taskFetchRepositoryStub.resolves(existingTask);

      const result = await TaskService.getTasksFromProject(existingTask.id);

      expect(result).to.deep.equal(existingTask);
      expect(taskFetchRepositoryStub.calledOnce).to.be.true;
    });

    it('Should throw an error if the task could not be created', async () => {
      taskFetchRepositoryStub.withArgs(existingTask).throws(new Error('Could not get tasks'));
      // projectRepositoryStub.resolves({ id: projectID });

      try {
        await TaskService.getTasksFromProject(existingTask.id);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Could not get tasks');
      }
    });
  });
});
