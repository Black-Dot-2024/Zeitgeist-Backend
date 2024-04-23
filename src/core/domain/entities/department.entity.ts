import { SupportedDepartments } from '../../../utils/enums';

export interface DepartmentEntity {
  /**
   * @param id: string - The id of the department
   */
  id: string;

  /**
   * @param title: SupportedDepartments - The title of the department
   */
  title: SupportedDepartments;

  createdAt: Date;

  updatedAt?: Date | null;
}
