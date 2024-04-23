import { Prisma } from '../../..';
import { RoleEntity } from '../../domain/entities/role.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapRoleEntityFromDbModelToDbModel } from '../mappers/role-entity-from-db-model.mapper';

async function findById(id: string): Promise<RoleEntity> {
  try {
    const role = await Prisma.role.findUniqueOrThrow({
      where: { id: id },
    });

    if (!role) throw new NotFoundError('Role not found');

    return mapRoleEntityFromDbModelToDbModel(role);
  } catch (error: any) {
    throw new Error(`Role repository error: ${error.message}`);
  }
}

async function findByTitle(title: string): Promise<RoleEntity> {
  try {
    const role = await Prisma.role.findFirstOrThrow({
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

export const RoleRepository = { findById, findByTitle, findAll };
