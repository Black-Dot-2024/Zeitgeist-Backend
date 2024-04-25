import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { CompanyRepository } from '../../../infra/repositories/company.repository';
import { EmployeeTaskRepository } from '../../../infra/repositories/employee-task.repository';
import { EmployeeRepository } from '../../../infra/repositories/employee.repository';
import { ProjectRepository } from '../../../infra/repositories/project.repository';
import { TaskRepository } from '../../../infra/repositories/tasks.repository';
import { ProjectReportService } from '../project-report.service';

chai.use(chaiAsPromised);

describe('ProjectReportService', () => {
  let findProjectByIdStub: sinon.SinonStub;
  let findCompanyByIdStub: sinon.SinonStub;
  let findAllEmployeesStub: sinon.SinonStub;
  let findAllEmployeeTaskStub: sinon.SinonStub;
  let findTasksByProjectIdStub: sinon.SinonStub;

  beforeEach(() => {
    findProjectByIdStub = sinon.stub(ProjectRepository, 'findById');
    findCompanyByIdStub = sinon.stub(CompanyRepository, 'findById');
    findAllEmployeesStub = sinon.stub(EmployeeRepository, 'findAll');
    findAllEmployeeTaskStub = sinon.stub(EmployeeTaskRepository, 'findAll');
    findTasksByProjectIdStub = sinon.stub(TaskRepository, 'findTasksByProjectId');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getReport', () => {
    it('should return a complete report of a project based on the information of the project in the database', async () => {
      const companyId = randomUUID();
      const existingCompany = {
        id: companyId,
        name: 'Tecnológico de Monterrey',
        email: 'tec@itesm.mx',
        phoneNumber: '4421234567',
        landlinePhone: '4420987654',
        archived: false,
        createdAt: new Date(),
      };

      const projectId = randomUUID();
      const existingProject = {
        id: projectId,
        name: 'ITESM Project',
        matter: 'SAT',
        description: 'ITESM Project description',
        status: 'ACCEPTED',
        startDate: new Date(),
        createdAt: new Date(),
        idCompany: companyId,
      };

      const employeeId = randomUUID();
      const existingEmployee = {
        id: employeeId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        imageUrl: 'http://example.com/john.jpg',
        createdAt: new Date(),
        idRole: randomUUID(),
      };

      const taskId = randomUUID();
      const existingTask = {
        id: taskId,
        title: 'ITESM task',
        description: 'ITESM task description',
        status: 'DELAYED',
        startDate: new Date(),
        workedHours: 100,
        createdAt: new Date(),
        idProject: projectId,
      };

      const employeeTaskId = randomUUID();
      const existingEmployeeTask = {
        id: employeeTaskId,
        createdAt: new Date(),
        idEmployee: employeeId,
        idTask: taskId,
      };

      findProjectByIdStub.resolves(existingProject);
      findCompanyByIdStub.resolves(existingCompany);
      findAllEmployeesStub.resolves([existingEmployee]);
      findAllEmployeeTaskStub.resolves([existingEmployeeTask]);
      findTasksByProjectIdStub.resolves([existingTask]);

      const existingReport = {
        project: { ...existingProject, companyName: existingCompany.name },
        tasks: [
          {
            ...existingTask,
            employeeFirstName: existingEmployee.firstName,
            employeeLastName: existingEmployee.lastName,
          },
        ],
        statistics: {
          total: 1,
          done: 0,
          inprogress: 0,
          underrevision: 0,
          delayed: 1,
          postponed: 0,
          notstarted: 0,
          cancelled: 0,
        },
      };

      const result = await ProjectReportService.getReport(projectId);

      expect(result).to.eql(existingReport);
      expect(findProjectByIdStub.calledOnce).to.be.true;
      expect(findCompanyByIdStub.calledOnce).to.be.true;
      expect(findTasksByProjectIdStub.calledOnce).to.be.true;
      expect(findAllEmployeesStub.calledOnce).to.be.true;
      expect(findAllEmployeeTaskStub.calledOnce).to.be.true;
    });

    it('should throw an error if the project id does not exist', async () => {
      const errorMessage = 'An unexpected error occurred';
      findProjectByIdStub.rejects(new Error(errorMessage));

      await expect(ProjectReportService.getReport(randomUUID())).to.be.rejectedWith(Error, errorMessage);
    });
  });
});
