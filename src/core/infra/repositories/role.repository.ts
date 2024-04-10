import { Prisma } from '../../..';
import { Role } from '../../domain/entities/role.entity';

/**
 * Finds a role by its unique identifier.
 *
 * @param id: UUID - The unique identifier of the role to find
 * @returns {Promise<Role | null>} A promise that resolves to the role if
 *                                 found, or null if not
 */
async function findRoleById(id: string): Promise<Role | null> {
  return await Prisma.role.findUnique({
    where: { id },
  });
}

/**
 * Creates a new role with the provided data in the database.
 *
 * @param params: Role - The data to create the role with
 * @returns {Promise<Role>} A promise that resolves to the newly created role
 */
async function createRole(params: Role): Promise<Role> {
  return await Prisma.role.create({
    data: {
      id: params.id,
      title: params.title,
      created_at: params.created_at || new Date(),
      updated_at: params.updated_at || new Date(),
    },
  });
}

export const RoleRepository = { findRoleById, createRole };
