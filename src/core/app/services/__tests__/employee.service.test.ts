import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { SupportedDepartments, SupportedRoles } from '../../../../utils/enums';
import { DepartmentRepository } from '../../../infra/repositories/department.repository';
import { EmployeeRepository } from '../../../infra/repositories/employee.repository';
import { RoleRepository } from '../../../infra/repositories/role.repository';
import { SignIn } from '../../interfaces/employee.interface';
import { EmployeeService } from '../employee.service';
chai.use(chaiAsPromised);

describe('EmployeeService', () => {
  let findByEmailStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let findByTitleStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;
  let findByIdStub: sinon.SinonStub;

  beforeEach(() => {
    findByEmailStub = sinon.stub(EmployeeRepository, 'findByEmail');
    createStub = sinon.stub(EmployeeRepository, 'create');
    findByTitleStub = sinon.stub(RoleRepository, 'findByTitle');
    findAllStub = sinon.stub(EmployeeRepository, 'findAll');
    findByIdStub = sinon.stub(RoleRepository, 'findById');
    sinon
      .stub(DepartmentRepository, 'findByTitle')
      .resolves({ id: randomUUID(), title: SupportedDepartments.WITHOUT_DEPARTMENT, createdAt: new Date() });
    sinon
      .stub(DepartmentRepository, 'findById')
      .resolves({ id: randomUUID(), title: SupportedDepartments.WITHOUT_DEPARTMENT, createdAt: new Date() });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should throw an error if the role does not exist', async () => {
    findByEmailStub.resolves(null);
    findByTitleStub.withArgs(SupportedRoles.WITHOUT_ROLE).rejects(new Error('Role not found'));

    const body: SignIn = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      imageUrl: 'http://example.com/john.jpg',
    };

    await expect(EmployeeService.signIn(body)).to.be.rejectedWith(Error, 'Role not found');

    expect(findByTitleStub.calledOnceWith(SupportedRoles.WITHOUT_ROLE)).to.be.true;
    expect(createStub.called).to.be.false;
  });

  it('should fetch all employees in an array of data', async () => {
    const employees = [
      {
        id: randomUUID(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'joe.doe@email.com',
        imageUrl: 'http://example.com/john.jpg',
        createdAt: new Date(),
        idRole: randomUUID(),
      },
      {
        id: randomUUID(),
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@email.com',
        imageUrl: 'http://example.com/jane.jpg',
        createdAt: new Date(),
        idRole: randomUUID(),
      },
    ];

    findAllStub.resolves(employees);

    const result = await EmployeeService.getAllEmployees();

    expect(result).to.eql(employees);
    expect(findAllStub.calledOnce).to.be.true;
  });

  describe('signIn', () => {
    it('should create a new employee and return expected data if no existing employee is found', async () => {
      findByEmailStub.resolves(null);
      const response = {
        employee: {
          id: randomUUID(),
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          imageUrl: 'http://example.com/john.jpg',
          idRole: randomUUID(),
          idDepartment: randomUUID(),
          createdAt: new Date(),
        },
        role: SupportedRoles.WITHOUT_ROLE,
        department: SupportedDepartments.WITHOUT_DEPARTMENT,
      };
      sinon.stub(EmployeeService, 'signIn').resolves(response);

      findByIdStub.resolves({ title: SupportedRoles.WITHOUT_ROLE });

      const result = await EmployeeService.signIn({
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        imageUrl: 'http://example.com/john.jpg',
      });

      expect(result.role).to.equal(SupportedRoles.WITHOUT_ROLE);
      expect(result.department).to.equal(SupportedDepartments.WITHOUT_DEPARTMENT);
    });

    it('should return existing employee data if the employee is found', async () => {
      const existingEmployee = {
        id: randomUUID(),
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        imageUrl: 'http://example.com/john.jpg',
        idRole: randomUUID(),
        idDepartment: randomUUID(),
        createdAt: new Date(),
      };

      findByEmailStub.resolves(existingEmployee);
      findByIdStub.resolves({ title: SupportedRoles.WITHOUT_ROLE });

      const result = await EmployeeService.signIn({
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        imageUrl: 'http://example.com/john.jpg',
      });

      expect(result.employee).to.eql(existingEmployee);
      expect(result.role).to.equal(SupportedRoles.WITHOUT_ROLE);
    });
  });
});
