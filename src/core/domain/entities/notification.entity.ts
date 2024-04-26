/**
 * @brief This class establishes the structure of the Notification entity
 *
 * @param id: string
 * @param title: string
 * @param body: string
 * @param createdAt: Date
 * @param updatedAt: Date
 *
 * @return void
 *
 * @description The structure contains the data of the Notification schema
 *
 */

export interface Notification {
  /**
   * @param id: string - Unique identifier of the notification
   */
  id: string;

  /**
   * @param title: string - Notification title
   */
  title: string;

  /**
   * @param body: string - Notification body
   */
  body: string;

  /**
   * @param createdAt: Date - Creation date of the notification
   */
  createdAt: Date;

  /**
   * @param updatedAt: Date - Last update date of the notification
   */
  updatedAt?: Date;
}
