import { DepartmentEntity } from '../../domain/entities/department.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapDepartmentEntityFromDbModelToDbModel } from '../mappers/department-entity-from-db-model.mapper';
import { Prisma } from '../providers/prisma.provider';

async function findById(id: string): Promise<DepartmentEntity> {
  try {
    const department = await Prisma.department.findUnique({
      where: { id: id },
    });

    if (!department) throw new NotFoundError('Department not found');

    return mapDepartmentEntityFromDbModelToDbModel(department);
  } catch (error: any) {
    throw new Error(`Department repository error: ${error.message}`);
  }
}

async function findByTitle(title: string): Promise<DepartmentEntity> {
  try {
    const department = await Prisma.department.findFirstOrThrow({
      where: { title: title },
    });

    if (!department) throw new NotFoundError('Department not found');

    return mapDepartmentEntityFromDbModelToDbModel(department);
  } catch (error: any) {
    throw new Error(`Department repository error: ${error.message}`);
  }
}

async function findAll(): Promise<DepartmentEntity[]> {
  try {
    const departments = await Prisma.department.findMany();

    if (!departments) throw new NotFoundError('Departments not found');

    return departments.map(mapDepartmentEntityFromDbModelToDbModel);
  } catch (error: any) {
    throw new Error(`Department repository error: ${error.message}`);
  }
}

/**
 * Update department by employee id
 *
 * @param employeeId: string - employee id
 * @param departmentId: string - department id
 *
 * @returns DepartmentEntity - updated department
 */
async function updateDepartmentByEmployeeId(employeeId: string, departmentId: string): Promise<DepartmentEntity> {
  try {
    const department = await Prisma.$transaction(async prisma => {
      const updatedDepartment = await prisma.department.update({
        where: { id: departmentId },
        data: {
          employee: {
            connect: [{ id: employeeId }],
          },
        },
      });

      if (!updatedDepartment) throw new NotFoundError('Department not found');
      return updatedDepartment;
    });

    return mapDepartmentEntityFromDbModelToDbModel(department);
  } catch (error: any) {
    throw new Error(`Department repository error: ${error.message}`);
  }
}

export const DepartmentRepository = { findById, findByTitle, findAll, updateDepartmentByEmployeeId };
