import { project } from '@prisma/client';
import { ProjectEntity } from '../../domain/entities/project.entity';

export function mapProjectEntityFromDbModel(model: project): ProjectEntity {
  return {
    id: model.id,
    name: model.name,
    matter: model.matter ? model.matter : null,
    description: model.description ? model.description : null,
    status: model.status,
    category: model.category,
    startDate: model.start_date,
    endDate: model.end_date ? model.end_date : null,
    totalHours: model.total_hours ? model.total_hours : null,
    periodicity: model.periodicity ? model.periodicity : null,
    isChargeable: model.is_chargeable ? model.is_chargeable : null,
    area: model.area ?? '',
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : null,
    idCompany: model.id_company,
  };
}
