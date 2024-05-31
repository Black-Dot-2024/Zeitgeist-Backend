import { faker } from '@faker-js/faker';
import { expect } from 'chai';
import { randomUUID } from 'crypto';
import { default as Sinon, default as sinon } from 'sinon';
import { ExpenseReportStatus, SupportedRoles } from '../../../../utils/enums';

import { Decimal } from '@prisma/client/runtime/library';
import { EmployeeRepository } from '../../../infra/repositories/employee.repository';
import { ExpenseRepository } from '../../../infra/repositories/expense.repository';
import { RoleRepository } from '../../../infra/repositories/role.repository';
import { ExpenseService } from '../expense.service';

describe('ExpenseService', () => {
  let findEmployeeByEmailStub: Sinon.SinonStub;
  let findRoleByEmailStub: Sinon.SinonStub;
  let findExpenseByIdStub: Sinon.SinonStub;
  let findExpenseByEmployeeIdStub: Sinon.SinonStub;
  let findAllExpensesStub: Sinon.SinonStub;
  let createExpenseReportStub: Sinon.SinonStub;
  let createExpenseStub: Sinon.SinonStub;

  beforeEach(() => {
    findEmployeeByEmailStub = sinon.stub(EmployeeRepository, 'findByEmail');
    findRoleByEmailStub = sinon.stub(RoleRepository, 'findByEmail');
    findExpenseByIdStub = sinon.stub(ExpenseRepository, 'findById');
    findExpenseByEmployeeIdStub = sinon.stub(ExpenseRepository, 'findByEmployeeId');
    findAllExpensesStub = sinon.stub(ExpenseRepository, 'findAll');
    createExpenseReportStub = sinon.stub(ExpenseRepository, 'createExpenseReport');
    createExpenseStub = sinon.stub(ExpenseRepository, 'createExpense');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getReportById', () => {
    it('Should return the expense report details', async () => {
      const reportId = randomUUID();
      const userEmail = faker.internet.email();
      const userId = randomUUID();

      const employee = {
        id: userId,
        email: userEmail,
        name: faker.lorem.words(2),
        role: SupportedRoles.ADMIN,
      };
      const role = {
        title: SupportedRoles.ADMIN,
      };
      const expenses = [
        {
          id: randomUUID(),
          title: faker.lorem.words(3),
          justification: faker.lorem.words(10),
          totalAmount: faker.number.float(),
          date: new Date(),
          createdAt: new Date(),
          idReport: reportId,
        },
      ];
      const existingReport = {
        id: reportId,
        title: faker.lorem.words(3),
        description: faker.lorem.words(10),
        startDate: new Date(),
        endDate: new Date(),
        status: ExpenseReportStatus.PENDING,
        createdAt: new Date(),
        idEmployee: userId,
        expenses: expenses,
      };

      findEmployeeByEmailStub.resolves(employee);
      findRoleByEmailStub.resolves(role);
      findExpenseByIdStub.resolves(existingReport);

      const res = await ExpenseService.getReportById(reportId, userEmail);

      expect(res).to.exist;
      expect(res).to.be.equal(existingReport);
      expect(res.id).to.equal(reportId);
      expect(res.expenses?.length).to.equal(expenses.length);
    });
  });

  describe('getExpenses', () => {
    const adminRoleId = randomUUID();
    const legalRoleId = randomUUID();
    const adminEmployeeId = randomUUID();
    const legalEmployeeId = randomUUID();

    const adminRole = {
      id: adminRoleId,
      title: SupportedRoles.ADMIN,
    };

    const legalRole = {
      id: legalRoleId,
      title: SupportedRoles.LEGAL,
    };

    const adminEmployee = {
      id: adminEmployeeId,
      firstName: faker.lorem.words(2),
      lastName: faker.lorem.words(3),
      email: faker.internet.email(),
      idRole: adminRoleId,
    };

    const legalEmployee = {
      id: legalEmployeeId,
      firstName: faker.lorem.words(2),
      lastName: faker.lorem.words(3),
      email: faker.internet.email(),
      idRole: legalRoleId,
    };

    const adminExpenseReportId = randomUUID();
    const legalExpenseReportId = randomUUID();

    const expenseReportAdmin = {
      id: adminExpenseReportId,
      title: faker.lorem.words(4),
      description: faker.lorem.words(8),
      startDate: new Date(),
      idEmployee: adminEmployeeId,
      totalAmount: 0,
    };

    const expenseReportLegal = {
      id: legalExpenseReportId,
      title: faker.lorem.words(4),
      description: faker.lorem.words(8),
      startDate: new Date(),
      idEmployee: legalEmployeeId,
      totalAmount: 0,
    };

    const adminExpenses = Array.from({ length: 4 }, () => ({
      id: randomUUID(),
      title: faker.lorem.words(4),
      justification: faker.lorem.words(8),
      totalAmount: 10,
      date: new Date(),
      idReport: adminExpenseReportId,
    }));

    const legalExpenses = Array.from({ length: 5 }, () => ({
      id: randomUUID(),
      title: faker.lorem.words(4),
      justification: faker.lorem.words(8),
      totalAmount: 100,
      date: new Date(),
      idReport: adminExpenseReportId,
    }));

    it('LEGAL: Should return their expense reports', async () => {
      findRoleByEmailStub.resolves(legalRole);
      findEmployeeByEmailStub.resolves(legalEmployee);
      findExpenseByEmployeeIdStub.resolves([
        {
          ...expenseReportLegal,
          employeeFirstName: legalEmployee.firstName,
          employeeLastName: legalEmployee.lastName,
          expenses: legalExpenses,
        },
      ]);

      const result = await ExpenseService.getExpenses(legalEmployee.email);

      expect(result).to.eql([
        {
          ...expenseReportLegal,
          employeeFirstName: legalEmployee.firstName,
          employeeLastName: legalEmployee.lastName,
          expenses: legalExpenses,
          totalAmount: new Decimal(500),
        },
      ]);
      expect(findRoleByEmailStub.calledOnce).to.be.true;
      expect(findEmployeeByEmailStub.calledOnce).to.be.true;
      expect(findExpenseByEmployeeIdStub.calledOnce).to.be.true;
    });

    it('ADMIN/ACCOUNTING: Should return all expense reports', async () => {
      findRoleByEmailStub.resolves(adminRole);
      findEmployeeByEmailStub.resolves(adminEmployee);
      findAllExpensesStub.resolves([
        {
          ...expenseReportLegal,
          employeeFirstName: legalEmployee.firstName,
          employeeLastName: legalEmployee.lastName,
          expenses: legalExpenses,
        },
        {
          ...expenseReportAdmin,
          employeeFirstName: adminEmployee.firstName,
          employeeLastName: adminEmployee.lastName,
          expenses: adminExpenses,
        },
      ]);

      const result = await ExpenseService.getExpenses(adminEmployee.email);

      expect(result).to.eql([
        {
          ...expenseReportLegal,
          employeeFirstName: legalEmployee.firstName,
          employeeLastName: legalEmployee.lastName,
          expenses: legalExpenses,
          totalAmount: new Decimal(500),
        },
        {
          ...expenseReportAdmin,
          employeeFirstName: adminEmployee.firstName,
          employeeLastName: adminEmployee.lastName,
          expenses: adminExpenses,
          totalAmount: new Decimal(40),
        },
      ]);
      expect(findRoleByEmailStub.calledOnce).to.be.true;
      expect(findEmployeeByEmailStub.calledOnce).to.be.true;
      expect(findAllExpensesStub.calledOnce).to.be.true;
    });

    it('Should throw an error if employee is not found', async () => {
      const errorMessage = 'Employee not found';
      findRoleByEmailStub.rejects(new Error(errorMessage));

      return await expect(ExpenseService.getExpenses(faker.internet.email())).to.be.rejectedWith(Error, errorMessage);
    });

    it('LEGAL: Should throw an error if data is not found', async () => {
      const errorMessage = 'An unexpected error occurred';

      findRoleByEmailStub.resolves(legalRole);
      findEmployeeByEmailStub.resolves(legalEmployee);
      findExpenseByEmployeeIdStub.rejects(new Error(errorMessage));

      return await expect(ExpenseService.getExpenses(legalEmployee.email)).to.be.rejectedWith(Error, errorMessage);
    });

    it('ADMIN/ACCOUNTING: Should throw an error if data is not found', async () => {
      const errorMessage = 'An unexpected error occurred';

      findRoleByEmailStub.resolves(adminRole);
      findEmployeeByEmailStub.resolves(adminEmployee);
      findAllExpensesStub.rejects(new Error(errorMessage));

      return await expect(ExpenseService.getExpenses(adminEmployee.email)).to.be.rejectedWith(Error, errorMessage);
    });
  });

  describe('getReportById', () => {
    it('Should return the expense report details', async () => {
      const reportId = randomUUID();
      const userEmail = faker.internet.email();
      const userId = randomUUID();

      const employee = {
        id: userId,
        email: userEmail,
        name: faker.lorem.words(2),
        role: SupportedRoles.ADMIN,
      };
      const role = {
        title: SupportedRoles.ADMIN,
      };
      const expenses = [
        {
          id: randomUUID(),
          title: faker.lorem.words(3),
          justification: faker.lorem.words(10),
          totalAmount: faker.number.float(),
          date: new Date(),
          createdAt: new Date(),
          idReport: reportId,
        },
      ];
      const existingReport = {
        id: reportId,
        title: faker.lorem.words(3),
        description: faker.lorem.words(10),
        startDate: new Date(),
        endDate: new Date(),
        status: ExpenseReportStatus.PENDING,
        createdAt: new Date(),
        idEmployee: userId,
        expenses: expenses,
      };

      findEmployeeByEmailStub.resolves(employee);
      findRoleByEmailStub.resolves(role);
      findExpenseByIdStub.resolves(existingReport);

      const res = await ExpenseService.getReportById(reportId, userEmail);

      expect(res).to.exist;
      expect(res).to.be.equal(existingReport);
      expect(res.id).to.equal(reportId);
      expect(res.expenses?.length).to.equal(expenses.length);
    });
  });

  describe('createExpenseReport', () => {
    it('Should create a new expense report', async () => {
      const userEmail = faker.internet.email();
      const userId = randomUUID();

      const employee = {
        id: userId,
        email: userEmail,
        name: faker.lorem.words(2),
        role: SupportedRoles.ADMIN,
      };

      const newExpenseReport = {
        id: randomUUID(),
        title: faker.lorem.words(3),
        description: faker.lorem.words(10),
        startDate: new Date(),
        expenses: [
          {
            id: randomUUID(),
            title: faker.lorem.words(3),
            justification: faker.lorem.words(10),
            supplier: faker.lorem.words(2),
            totalAmount: new Decimal(10.005),
            date: new Date(),
            urlFile: faker.internet.url(),
            createdAt: new Date('2021-01-01T00:00:00Z'),
          },
          {
            id: randomUUID(),
            title: faker.lorem.words(3),
            justification: faker.lorem.words(10),
            supplier: faker.lorem.words(2),
            totalAmount: new Decimal(10.005),
            date: new Date(),
            urlFile: faker.internet.url(),
            createdAt: new Date('2021-01-01T00:00:00Z'),
          },
        ],
      };

      const createdExpenseReport = {
        id: newExpenseReport.id,
        title: newExpenseReport.title,
        description: newExpenseReport.description,
        startDate: newExpenseReport.startDate,
        status: ExpenseReportStatus.PENDING,
        idEmployee: userId,
        expenses: [
          {
            id: newExpenseReport.expenses[0].id,
            title: newExpenseReport.expenses[0].title,
            justification: newExpenseReport.expenses[0].justification,
            supplier: newExpenseReport.expenses[0].supplier,
            totalAmount: new Decimal(newExpenseReport.expenses[0].totalAmount),
            status: ExpenseReportStatus.PAYED,
            category: 'viatico',
            date: newExpenseReport.expenses[0].date,
            createdAt: newExpenseReport.expenses[0].createdAt,
            idReport: newExpenseReport.id,
            urlFile: newExpenseReport.expenses[0].urlFile,
          },
          {
            id: newExpenseReport.expenses[1].id,
            title: newExpenseReport.expenses[1].title,
            justification: newExpenseReport.expenses[1].justification,
            supplier: newExpenseReport.expenses[1].supplier,
            totalAmount: new Decimal(newExpenseReport.expenses[1].totalAmount),
            status: ExpenseReportStatus.PAYED,
            category: 'viatico',
            date: newExpenseReport.expenses[1].date,
            createdAt: newExpenseReport.expenses[1].createdAt,
            idReport: newExpenseReport.id,
            urlFile: newExpenseReport.expenses[1].urlFile,
          },
        ],
      };

      findEmployeeByEmailStub.resolves(employee);
      createExpenseReportStub.resolves(createdExpenseReport);
      createExpenseStub.onCall(0).resolves(createdExpenseReport.expenses[0]);
      createExpenseStub.onCall(1).resolves(createdExpenseReport.expenses[1]);

      const res = await ExpenseService.createExpenseReport(userEmail, newExpenseReport);

      expect(res).to.exist;
      expect(res).to.deep.equal(createdExpenseReport);

      res.expenses?.forEach((expense, index) => {
        expect(expense.id).to.equal(createdExpenseReport.expenses[index].id);
        expect(expense.title).to.equal(createdExpenseReport.expenses[index].title);
        expect(expense.justification).to.equal(createdExpenseReport.expenses[index].justification);
        expect(expense.supplier).to.equal(createdExpenseReport.expenses[index].supplier);
        expect(expense.totalAmount.toString()).to.equal(createdExpenseReport.expenses[index].totalAmount.toString());
        expect(expense.status).to.equal(createdExpenseReport.expenses[index].status);
        expect(expense.category).to.equal(createdExpenseReport.expenses[index].category);
        expect(expense.date).to.deep.equal(createdExpenseReport.expenses[index].date);
        expect(expense.createdAt).to.deep.equal(createdExpenseReport.expenses[index].createdAt);
        expect(expense.idReport).to.equal(createdExpenseReport.expenses[index].idReport);
        expect(expense.urlFile).to.equal(createdExpenseReport.expenses[index].urlFile);
      });
    });
  });
});
