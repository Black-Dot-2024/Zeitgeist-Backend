import { task } from '@prisma/client';
import { TaskStatus } from '../../../utils/enums';
import { Task } from '../../domain/entities/task.entity';

export function mapTaskEntityFromDbModel(model: task): Task {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    status: model.status as TaskStatus,
    waitingFor: model.waiting_for ? model.waiting_for : undefined,
    startDate: model.start_date,
    endDate: model.end_date ? model.end_date : undefined,
    workedHours: Number(model.worked_hours) ? Number(model.worked_hours) : undefined,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : undefined,
    idProject: model.id_project,
  };
}
