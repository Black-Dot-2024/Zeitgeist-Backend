import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { SupportedRoles } from '../../../../utils/enums';
import { EmployeeRepository } from '../../../infra/repositories/employee.repository';
import { RoleRepository } from '../../../infra/repositories/role.repository';
import { EmployeeService, SignIn } from '../employee.services';
chai.use(chaiAsPromised);

describe('EmployeeService', () => {
  let findByEmailStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let findByTitleStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;

  beforeEach(() => {
    findByEmailStub = sinon.stub(EmployeeRepository, 'findByEmail');
    createStub = sinon.stub(EmployeeRepository, 'create');
    findByTitleStub = sinon.stub(RoleRepository, 'findByTitle');
    findAllStub = sinon.stub(EmployeeRepository, 'findAll');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create a new employee if no existing employee is found and role exists', async () => {
    const roleId = randomUUID();
    const existingEmployee = {
      id: randomUUID(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      imageUrl: 'http://example.com/john.jpg',
      createdAt: new Date(),
      idRole: roleId,
    };

    findByTitleStub.resolves({
      id: roleId,
      title: SupportedRoles.WITHOUT_ROLE,
    });

    findByEmailStub.resolves(existingEmployee);

    const body: SignIn = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      imageUrl: 'http://example.com/john.jpg',
    };

    const result = await EmployeeService.signIn(body);

    expect(result).to.eql(existingEmployee);
    expect(findByEmailStub.calledOnce).to.be.true;
    expect(createStub.called).to.be.false;
    expect(findByTitleStub.calledOnceWith(SupportedRoles.WITHOUT_ROLE)).to.be.true;
  });

  it('should create a new employee if no existing employee is found and role exists', async () => {
    const roleId = randomUUID();
    const newEmployee = {
      id: randomUUID(),
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      imageUrl: 'http://example.com/john.jpg',
      createdAt: new Date(),
      idRole: roleId,
    };

    findByEmailStub.resolves(null);
    findByTitleStub.resolves({
      id: roleId,
      title: SupportedRoles.WITHOUT_ROLE,
    });
    createStub.resolves(newEmployee);

    const body: SignIn = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      imageUrl: 'http://example.com/john.jpg',
    };

    const result = await EmployeeService.signIn(body);

    expect(result).to.eql(newEmployee);
    expect(findByEmailStub.calledOnceWith('john.doe@example.com')).to.be.true;
    expect(findByTitleStub.calledOnceWith(SupportedRoles.WITHOUT_ROLE)).to.be.true;
    expect(createStub.calledOnce).to.be.true;
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
});
