import { SupportedRoles } from '../../../utils/enums';
import { RoleEntity } from '../../domain/entities/role.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapRoleEntityFromDbModelToDbModel } from '../mappers/role-entity-from-db-model.mapper';
import { Prisma } from '../providers/prisma.provider';

/**
 * Retrieves the role of an employee by email
 * @param email The email from the requester
 * @returns The role of the employee
 */
async function findByEmail(email: string): Promise<RoleEntity> {
  try {
    const role = await Prisma.employee.findUnique({
      where: { email: email },
      include: {
        role: true,
      },
    });

    if (!role) throw new NotFoundError('Role not found');

    return mapRoleEntityFromDbModelToDbModel(role.role);
  } catch (error: any) {
    throw new Error(`Role repository error: ${error.message}`);
  }
}

async function findById(id: string): Promise<RoleEntity> {
  try {
    const role = await Prisma.role.findUnique({
      where: { id: id },
    });

    if (!role) throw new NotFoundError('Role not found');

    return mapRoleEntityFromDbModelToDbModel(role);
  } catch (error: any) {
    throw new Error(`Role repository error: ${error.message}`);
  }
}

async function findByTitle(title: SupportedRoles): Promise<RoleEntity> {
  try {
    const role = await Prisma.role.findFirst({
      where: { title: title },
    });

    if (!role) throw new NotFoundError('Role not found');

    return mapRoleEntityFromDbModelToDbModel(role);
  } catch (error: any) {
    throw new Error(`Role repository error: ${error.message}`);
  }
}

async function findAll(): Promise<RoleEntity[]> {
  try {
    const roles = await Prisma.role.findMany();

    if (!roles) throw new NotFoundError('Roles not found');

    return roles.map(mapRoleEntityFromDbModelToDbModel);
  } catch (error: any) {
    throw new Error(`Role repository error: ${error.message}`);
  }
}

export const RoleRepository = { findById, findByTitle, findAll, findByEmail };
