/**
 * Establishes the structure of the role entity.
 *
 * @param id: string - Unique identifier of the role
 * @param title: string - Title of the role
 * @param created_at: Date - Date the role was created
 * @param updated_at: Date - Date the role was last updated
 * @param employee: Employee - Employee associated with the role
 */
export interface Role {
  id: string;
  title: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  // employee: Employee;
}
