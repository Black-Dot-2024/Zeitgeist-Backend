import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { TaskStatus } from '../../../../utils/enums';
import { BareboneTask } from '../../../domain/entities/task.entity';
import { ProjectRepository } from '../../../infra/repositories/project.repository';
import { TaskRepository } from '../../../infra/repositories/tasks.repository';
import { Task } from '../../interfaces/project-report.interface';
import { TaskService } from '../task.service';

faker.seed(12345);

describe('TaskService', () => {
  let createTaskStub: sinon.SinonStub;
  let findTasksByEmployeeIdStub: sinon.SinonStub;
  let projectRepositoryStub: sinon.SinonStub;

  beforeEach(() => {
    createTaskStub = sinon.stub(TaskRepository, 'createTask');
    findTasksByEmployeeIdStub = sinon.stub(TaskRepository, 'findTasksByIds');

    projectRepositoryStub = sinon.stub(ProjectRepository, 'findById');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createTask', () => {
    it('Should create missing attributes and send them to the repository', async () => {
      const createdTask: Task = {
        id: randomUUID(),
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        waitingFor: faker.person.fullName(),
        startDate: faker.date.recent(),
        endDate: faker.date.future(),
        workedHours: faker.number.int(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.future(),
        idProject: randomUUID(),
      };

      const barebonesTask: Partial<Task> = {
        title: createdTask.title,
        description: createdTask.description,
        status: createdTask.status,
        waitingFor: createdTask.waitingFor,
        startDate: createdTask.startDate,
        endDate: createdTask.endDate,
        workedHours: createdTask.workedHours,
        idProject: createdTask.idProject,
      };

      createTaskStub.resolves(createdTask);
      projectRepositoryStub.resolves({ id: createdTask.idProject });

      const result = await TaskService.createTask(barebonesTask as BareboneTask);

      expect(result).to.deep.equal(createdTask);
      expect(createTaskStub.calledOnce).to.be.true;
    });

    it('Should not create a new task if the project does not exist', async () => {
      const barebonesTask: BareboneTask = {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        waitingFor: faker.person.fullName(),
        startDate: faker.date.recent(),
        dueDate: faker.date.future(),
        workedHours: faker.number.int(),
        idProject: randomUUID(),
      };

      projectRepositoryStub.resolves({});

      try {
        await TaskService.createTask(barebonesTask);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Project not found');
      }
    });

    it('Should return null if the task already exists', async () => {
      const barebonesTask: BareboneTask = {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        waitingFor: faker.person.fullName(),
        startDate: faker.date.recent(),
        dueDate: faker.date.future(),
        workedHours: faker.number.int(),
        idProject: randomUUID(),
      };

      createTaskStub.resolves(null);
      projectRepositoryStub.resolves({ id: barebonesTask.idProject });

      const result = await TaskService.createTask(barebonesTask);

      expect(result).to.be.null;
      expect(createTaskStub.calledOnce).to.be.true;
    });

    it('Should throw an error if the task could not be created', async () => {
      const barebonesTask: BareboneTask = {
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(Object.values(TaskStatus)),
        waitingFor: faker.person.fullName(),
        startDate: faker.date.recent(),
        dueDate: faker.date.future(),
        workedHours: faker.number.int(),
        idProject: randomUUID(),
      };

      createTaskStub.withArgs(barebonesTask).throws(new Error('Could not create task'));
      projectRepositoryStub.resolves({ id: barebonesTask.idProject });

      try {
        await TaskService.createTask(barebonesTask);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Could not create task');
      }
    });
  });

  describe('findTasksByEmployeeId', () => {});
});
