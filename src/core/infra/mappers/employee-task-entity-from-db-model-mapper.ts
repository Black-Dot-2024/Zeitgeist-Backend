import { employee_task } from '@prisma/client';
import { EmployeeTask } from '../../domain/entities/employee-task.entity';

export function mapEmployeeTaskEntityFromDbModel(model: employee_task): EmployeeTask {
  return {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : undefined,
    idEmployee: model.id_employee,
    idTask: model.id_task,
  };
}
