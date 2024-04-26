/**
 * @brief Esta clase establece la estructura de la entidad Employee
 *
 * @param id: string
 * @param firstName: string
 * @param lastName: string
 * @param email: string
 * @param imageUrl: string
 * @param createdAt: Date
 * @param updatedAt: Date
 * @param idDepartment: string
 * @param idRole: string
 * @param deviceToken: string
 *
 * @return void
 *
 * @description La estructura contiene los datos del esquema de Employee.
 *
 */

export interface EmployeeEntity {
  /**
   * @param id string: The id of the employee.
   */
  id: string;

  /**
   * @param firstName string: The first name of the employee.
   */
  firstName: string;

  /**
   * @param lastName string: The last name of the employee.
   */
  lastName: string;

  /**
   * @param email string: The email of the employee.
   */
  email: string;

  /**
   * @param imageUrl string: The image url of the employee.
   */
  imageUrl?: string;

  /**
   * @param createdAt Date: The date when the employee was created.
   */
  createdAt: Date;

  /**
   * @param updatedAt Date: The date when the employee was updated.
   */
  updatedAt?: Date;

  /**
   * @param idDepartment string: The id of the department where the employee belongs.
   */
  idDepartment?: string;

  /**
   * @param idRole string: The id of the role of the employee.
   */
  idRole: string;

  /**
   * @param deviceToken string: The device token of the employee.
   */
  deviceToken?: string;
}
