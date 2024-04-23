import { Prisma } from '../../..';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapEmployeeEntityFromDbModel } from '../mappers/employee-entity-from-db-model.mapper';

const RESOURCE_NAME = 'Employee';

async function findAll(): Promise<EmployeeEntity[]> {
  try {
    const data = await Prisma.employee.findMany();

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return data.map(mapEmployeeEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`Failed to fetch all employees: ${error}`);
  }
}

async function findById(id: string): Promise<EmployeeEntity> {
  try {
    const data = await Prisma.employee.findUnique({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapEmployeeEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error('Employee repository error');
  }
}

async function updateRoleById(id: string, roleId: string): Promise<EmployeeEntity> {
  try {
    const data = await Prisma.employee.update({
      where: {
        id: id,
      },
      data: {
        id_role: roleId,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapEmployeeEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error('Employee repository error');
  }
}

async function findByEmail(email: string): Promise<EmployeeEntity | null> {
  try {
    const data = await Prisma.employee.findFirst({
      where: {
        email,
      },
    });

    if (!data) {
      return null;
    }

    return mapEmployeeEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`Failed to fetch employee by email: ${error}`);
  }
}

async function existByEmail(email: string): Promise<boolean> {
  try {
    const data = await Prisma.employee.findUnique({
      where: {
        email: email,
      },
    });

    return !!data;
  } catch (error: unknown) {
    throw new Error(`Failed to find employee by email: ${error}`);
  }
}

async function create(entity: EmployeeEntity): Promise<EmployeeEntity> {
  try {
    await Prisma.employee.create({
      data: {
        id: entity.id,
        first_name: entity.firstName,
        last_name: entity.lastName,
        email: entity.email,
        image_url: entity.imageUrl,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt,
        id_department: entity.idDepartment,
        id_role: entity.idRole,
      },
    });

    return entity;
  } catch (error: any) {
    throw new Error(`Failed to create employee: ${error.message}`);
  }
}

export const EmployeeRepository = { create, findAll, findByEmail, findById, existByEmail, updateRoleById };
