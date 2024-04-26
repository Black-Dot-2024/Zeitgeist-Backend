import { Notification } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../infra/repositories/notification.repository';

/**
 * @brief Interface for the userToken
 *
 * @param email: string
 * @param deviceToken: string
 *
 * @returns userToken
 */
export interface userToken {
  email: string;
  deviceToken: string;
}

/**
 * @brief Function that saves the token of the employee
 *
 * @param body: userToken
 */

async function saveToken(body: userToken) {
  try {
    return await NotificationRepository.saveToken(body.email, body.deviceToken);
  } catch (error) {
    throw new Error('Error saving token.' + error);
  }
}

/**
 * Creates notification data in the repository
 *
 * @param {Notification} notification - The notification entity
 *
 * @returns {Promise<Notification>} A promise that resolves to the created
 *
 * @throws {Error} If an unexpected error occurs
 */

async function createNotification(notification: Notification): Promise<Notification> {
  try {
    const notificationRecord = await NotificationRepository.createNotification(notification);
    return notificationRecord;
  } catch (error: any) {
    throw new Error('Error creating notification.' + error);
  }
}

/**
 * Gets notification data from the repository
 *
 * @returns {Promise<Notification[]>} A promise that resolves to an array of
 *                                  notification entities
 *
 * @throws {Error} If an unexpected error occurs
 */

async function getAllNotifications(): Promise<Notification[]> {
  try {
    const notificationRecords = await NotificationRepository.findAllNotifications();
    return notificationRecords;
  } catch (error: any) {
    throw new Error('Error getting notifications.' + error);
  }
}

export const NotificationService = { saveToken, getAllNotifications, createNotification };
