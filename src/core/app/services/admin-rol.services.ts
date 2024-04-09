import { EmployeeRepository } from "../../infra/repositories/employee.repository";
import { RoleRepository } from "../../infra/repositories/role.repository";

async function updateUserRol(userId: string, roleId: string): Promise<void> {
    try {
        // Check if user exists
        await EmployeeRepository.findById(userId);

        // Check if role exists
        await RoleRepository.findById(roleId);

        // Update User role
        await EmployeeRepository.updateRoleById(userId, roleId);

    } catch (error: any) {
        console.error('Error: ', error);
        throw new Error('An unexpected error occurred');
    }
}

export { updateUserRol };