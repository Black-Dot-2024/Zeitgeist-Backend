import { validate as uuidValidate } from 'uuid';
import { Role } from '../../domain/entities/role.entity';
import { RoleRepository } from '../../infra/repositories/role.repository';

/**
 * Creates a new role with the provided data in the database.
 *
 * @param params: Role - The data to create the role with
 *
 * @returns {Promise<Role>} A promise that resolves to the newly created role
 *
 * @throws {Error} If an unexpected error occurs
 */
async function createRole(params: Role): Promise<Role> {
  if (!uuidValidate(params.id)) {
    throw new Error('Invalid UUID format for role ID');
  }

  try {
    const existingRole = await RoleRepository.findRoleById(params.id);

    if (existingRole) {
      throw new Error('Role already exists');
    }

    const newRole = await RoleRepository.createRole(params);
    return newRole;
  } catch (error: any) {
    console.error('The role could not be created at service level', error);
    throw new Error('Failed to create role');
  }
}

/**
 * Deletes a role from the database.
 *
 * @param params: Role - The data to create the role with
 *
 * @returns {Promise<Role>} A promise that resolves to the newly created role
 *
 * @throws {Error} If an unexpected error occurs
 */
async function deleteRole(params: Role): Promise<Role> {
  if (!uuidValidate(params.id)) {
    throw new Error('Invalid UUID format for role ID');
  }

  try {
    const roleDoesNotExist = await RoleRepository.doesRoleNotExist(params.id);

    if (roleDoesNotExist) {
      throw new Error('Role does not exist in the database. Aborting delete operation');
    }

    const deletedRole = await RoleRepository.deleteRoleById(params.id);
    return deletedRole;
  } catch (error: any) {
    console.error('The role could not be deleted at service level', error);
    throw new Error('Failed to delete role');
  }
}

export const RoleService = { createRole, deleteRole };
