import { SupportedRoles } from '../../../utils/enums';

export interface RoleEntity {
  /**
   * @param id: string - The id of the role
   */
  id: string;

  /**
   * @param title: SupportedRoles - The title of the role
   */
  title: SupportedRoles;

  createdAt: Date;

  updatedAt?: Date | null;
}
