import { ExpenseReportStatus } from '../../../utils/enums';
import { ExpenseEntity, ExpenseReport } from '../../domain/entities/expense.entity';
import { NotFoundError } from '../../errors/not-found.error';
import {
  mapExpenseEntityFromDbModel,
  mapExpenseReportEntityFromDbModel,
} from '../mappers/expense-entity-from-db-model.mapper';
import { Prisma } from '../providers/prisma.provider';

const RESOURCE_NAME = 'Expense report';

/**
 * Finds a expense report by employeeId
 * @version 1.0.0
 * @returns {Promise<ExpenseReport[]>} a promise that resolves in a expense report entity.
 */
async function findAll(): Promise<ExpenseReport[]> {
  try {
    const data = await Prisma.expense_report.findMany({
      include: {
        expense: true,
        employee: true,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapExpenseReportEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Finds a expense report by id
 * @version 1.0.0
 * @returns {Promise<ExpenseReport>} a promise that resolves in a expense report entity.
 */
async function findById(id: string): Promise<ExpenseReport> {
  try {
    const data = await Prisma.expense_report.findUnique({
      where: {
        id: id,
      },
      include: {
        expense: true,
        employee: true,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapExpenseReportEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Finds a expense report by employeeId
 * @version 1.0.0
 * @returns {Promise<ExpenseReport[]>} a promise that resolves in a expense report entity.
 */
async function findByEmployeeId(id: string): Promise<ExpenseReport[]> {
  try {
    const data = await Prisma.expense_report.findMany({
      where: {
        id_employee: id,
      },
      include: {
        expense: true,
        employee: true,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapExpenseReportEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Creates a new expense report in the database
 * @version 1.0.0
 * @returns {Promise<ExpenseReport>} a promise that resolves in a expense report entity.
 */
async function createExpenseReport(data: ExpenseReport): Promise<ExpenseReport> {
  try {
    const expenseReport = await Prisma.expense_report.create({
      data: {
        id: data.id,
        title: data.title,
        status: data.status,
        start_date: data.startDate,
        id_employee: data.idEmployee!,
      },
      include: {
        employee: true,
      },
    });

    return mapExpenseReportEntityFromDbModel(expenseReport);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Creates a new expense in the database and associates it with an expense report
 * @version 1.0.0
 * @returns {Promise<ExpenseEntity>} a promise that resolves in a expense entity.
 */

async function createExpense(data: ExpenseEntity): Promise<ExpenseEntity> {
  try {
    const expense = await Prisma.expense.create({
      data: {
        id: data.id,
        title: data.title,
        supplier: data.supplier,
        total_amount: data.totalAmount,
        date: data.date,
        id_report: data.idReport,
        url_file: data.urlFile,
      },
    });

    return mapExpenseEntityFromDbModel(expense);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Deletes a expense report
 * @version 1.0.0
 * @returns {Promise<ExpenseReport>}
 */

async function deleteReport(reportId: string): Promise<ExpenseReport> {
  try {
    const data = await Prisma.expense_report.delete({
      where: {
        id: reportId,
      },
      include: { expense: true, employee: true },
    });
    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapExpenseReportEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Updates a expense's status
 * @version 1.0.0
 * @returns {Promise<ExpenseReport>} a promise that resolves in a expense
 */
async function updateStatusById(id: string, status: ExpenseReportStatus): Promise<ExpenseReport> {
  try {
    const data = await Prisma.expense_report.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapExpenseReportEntityFromDbModel(data);
  } catch (error: any) {
    if (error.code == 'P2025' && error.meta.cause == 'Record to update not found.')
      throw new Error('Expense not found');
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Updates a expense's payment url (url_voucher)
 * @version 1.0.0
 * @returns {Promise<ExpenseReport>} a promise that resolves in a expense
 */
async function updatePaymentFileUrlById(id: string, urlVoucher: string): Promise<ExpenseReport> {
  try {
    const data = await Prisma.expense_report.update({
      where: {
        id: id,
      },
      data: {
        url_voucher: urlVoucher,
      },
    });
    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapExpenseReportEntityFromDbModel(data);
  } catch (error: any) {
    if (error.code == 'P2025' && error.meta.cause == 'Record to update not found.')
      throw new Error('Expense not found');
    throw new Error('An unexpected error occurred');
  }
}

export const ExpenseRepository = {
  findAll,
  findById,
  findByEmployeeId,
  createExpenseReport,
  createExpense,
  updateStatusById,
  updatePaymentFileUrlById,
  deleteReport,
};
