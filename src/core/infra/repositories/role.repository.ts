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
 * Verifies if the role does not exist in the database.
 * 
 * @param id: string - The unique identifier of the role to find
 * @returns {Promise<boolean>} A promise that resolves if the role is null
 */
async function doesRoleNotExist(id: string): Promise<boolean> {
  const role = await findRoleById(id);
  return role === null;
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

/**
 * Deletes a role by its unique identifier.
 *
 * @param id: UUID - The unique identifier of the role to delete
 * @returns {Promise<Role>} A promise that resolves to the deleted role
 */
async function deleteRoleById(id: string): Promise<Role> {
  return await Prisma.role.delete({
    where: { id },
  });
}

export const RoleRepository = { findRoleById, doesRoleNotExist, createRole, deleteRoleById };
