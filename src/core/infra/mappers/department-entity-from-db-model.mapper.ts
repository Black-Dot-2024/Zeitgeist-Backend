import { department } from '@prisma/client';
import { SupportedDepartments } from '../../../utils/enums';
import { DepartmentEntity } from '../../domain/entities/department.entity';

function supportedDepartmentsFromString(maybeSupportedDepartment: string): SupportedDepartments {
  if (maybeSupportedDepartment.toUpperCase() === SupportedDepartments.WITHOUT_DEPARTMENT) {
    return SupportedDepartments.WITHOUT_DEPARTMENT;
  }

  if (maybeSupportedDepartment.toUpperCase() === SupportedDepartments.CONTABLE) {
    return SupportedDepartments.CONTABLE;
  }

  if (maybeSupportedDepartment.toUpperCase() === SupportedDepartments.LEGAL) {
    return SupportedDepartments.LEGAL;
  }

  throw new Error(`Unsupported department: ${maybeSupportedDepartment}`);
}

export function mapDepartmentEntityFromDbModelToDbModel(department: department): DepartmentEntity {
  return {
    id: department.id,
    title: supportedDepartmentsFromString(department.title),
    createdAt: department.created_at,
    updatedAt: department.updated_at,
  };
}
