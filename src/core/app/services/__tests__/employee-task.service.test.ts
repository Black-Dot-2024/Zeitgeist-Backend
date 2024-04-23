import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { TaskStatus } from '../../../../utils/enums';
import { Task } from '../../../domain/entities/task.entity';
import { EmployeeTaskRepository } from '../../../infra/repositories/employee-task.repository';
import { EmployeeRepository } from '../../../infra/repositories/employee.repository';
import { EmployeeTaskService } from '../employee-task.services';

describe('employeeTaskService', () => {
  let employeeRepositoryStub: sinon.SinonStub;
  let employeeTaskRepositoryStub: sinon.SinonStub;

  const userId = randomUUID();
  const tasks: Task[] = Array.from({ length: 10 }, () => ({
    id: randomUUID(),
    title: faker.lorem.words(5),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(Object.values(TaskStatus)),
    waitingFor: faker.person.fullName(),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    workedHours: faker.number.int(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    idProject: '',
  }));

  tasks.forEach((task, index) => {
    task.idProject = index < 5 ? tasks[index + 5].idProject : tasks[index - 5].idProject;
  });

  beforeEach(() => {
    employeeRepositoryStub = sinon.stub(EmployeeRepository, 'findById');
    employeeTaskRepositoryStub = sinon.stub(EmployeeTaskRepository, 'getTasksByEmployeeId');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getTaskByEmployeeId', () => {
    it('Should fetch all the tasks assigned to the user', async () => {
      employeeRepositoryStub.resolves({ id: userId });
      employeeTaskRepositoryStub.resolves(tasks);

      const result = await EmployeeTaskService.getTasksByEmployeeId(userId);

      expect(result).to.deep.equal(tasks);
    });

    it('Should return an empty array if the employee has no tasks', async () => {
      employeeRepositoryStub.resolves({ id: userId });
      employeeTaskRepositoryStub.resolves([]);

      const result = await EmployeeTaskService.getTasksByEmployeeId(userId);

      expect(result).to.deep.equal([]);
    });

    it('Should throw an error if the employee ID is not valid', async () => {
      employeeRepositoryStub.resolves({});

      try {
        await EmployeeTaskService.getTasksByEmployeeId(userId);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.be.equal('Employee does not exist');
      }
    });

    it('Should throw an error if there was a problem fetching the tasks', async () => {
      employeeRepositoryStub.resolves({ id: userId });
      employeeTaskRepositoryStub.rejects(new Error('Database error'));

      try {
        await EmployeeTaskService.getTasksByEmployeeId(userId);
      } catch (error: any) {
        expect(error).to.be.an('error');
        expect(error.message).to.be.equal('There was an error getting the tasks for the employee with id ' + userId);
      }
    });
  });
});
