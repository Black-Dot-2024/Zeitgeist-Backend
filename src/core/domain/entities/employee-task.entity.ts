/**
 * @brief Esta clase establece la estructura de la entidad EmployeeTask
 *
 * @param id: string
 * @param createdAt: Date
 * @param updatedAt: Date
 * @param idEmployee: string
 * @param idTask: string
 *
 * @return void
 *
 * @description La estructura contiene los datos del esquema de EmployeeTask.
 *
 */

export interface EmployeeTask {
  /**
   * @param id: string - Identificador único de la relación
   */
  id: string;

  /**
   * @param createdAt: Date - Fecha de registro de la relación
   */
  createdAt: Date;

  /**
   * @param updatedAt: Date - Última fecha de modificación
   */

  updatedAt?: Date;

  /**
   * @param idEmployee: string - Identificador único del empleado asociado
   */
  idEmployee: string;

  /**
   * @param idTask: string - Identificador único de la tarea asociada
   */
  idTask: string;
}
