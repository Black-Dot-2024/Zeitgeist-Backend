import { employee } from '@prisma/client';
import { EmployeeEntity } from '../../domain/entities/employee.entity';

export function mapEmployeeEntityFromDbModel(model: employee): EmployeeEntity {
  return {
    id: model.id,
    firstName: model.first_name,
    lastName: model.last_name,
    email: model.email,
    imageUrl: model.image_url ? model.image_url : undefined,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : undefined,
    idDepartment: model.id_department ? model.id_department : undefined,
    idRole: model.id_role,
  };
}
