/**
 * @brief This class establishes the structure of the EmployeeNotification entity
 *
 * @param id: string - Unique identifier of the relationship
 * @param createdAt: Date - Creation date of the notification
 * @param updatedAt: Date - Last update date of the notification (optional)
 * @param idEmployee: string - Unique identifier of the employee related to the notification
 * @param idNotification: string - Unique identifier of the notification
 *
 * @return void
 *
 * @description The structure contains the data of the EmployeeNotification schema
 */

export interface EmployeeNotification {
  /**
   * @param id: string - Unique identifier of the relationship
   */
  id: string;

  /**
   * @param createdAt: Date - Creation date of the notification
   */
  createdAt: Date;

  /**
   * @param updatedAt: Date - Last update date of the notification
   */
  updatedAt?: Date;

  /**
   * @param idEmployee: string - Unique identifier of the employee related to the notification
   */
  idEmployee: string;

  /**
   * @param idNotification: string - Unique identifier of the notification
   */
  idNotification: string;
}
