import { notification } from '@prisma/client';
import { Notification } from '../../domain/entities/notification.entity';

/**
 * Maps a notification entity from a database model.
 *
 * @param model The database model.
 * @returns The notification entity.
 *
 */

export function mapNotificationEntityFromDbModel(model: notification): Notification {
  return {
    id: model.id,
    title: model.title,
    body: model.body,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : undefined,
  };
}
