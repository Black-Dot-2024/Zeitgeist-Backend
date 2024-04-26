import { employee_notification } from '@prisma/client';
import { EmployeeNotification } from '../../domain/entities/employee-notification.entity';

/**
 * Maps a notification entity from a database model.
 *
 * @param model The database model.
 * @returns The notification entity.
 *
 */

export function mapEmployeeNotificationEntityFromDbModel(model: employee_notification): EmployeeNotification {
  return {
    id: model.id,
    idEmployee: model.id_employee,
    idNotification: model.id_notification,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : undefined,
  };
}
