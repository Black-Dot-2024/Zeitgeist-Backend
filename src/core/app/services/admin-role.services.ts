import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { EmployeeRepository } from '../../infra/repositories/employee.repository';

// Async function to update the role of a user
async function updateUserRole(userId: string, roleId: string): Promise<EmployeeEntity> {
  try {
    return await EmployeeRepository.updateRoleById(userId, roleId);
  } catch (error: any) {
    throw new Error('An unexpected error occurred');
  }
}

export { updateUserRole };
