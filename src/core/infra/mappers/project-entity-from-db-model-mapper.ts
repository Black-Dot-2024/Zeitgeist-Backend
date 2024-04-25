import { project } from '@prisma/client';
import { ProjectStatus } from '../../../utils/enums';
import { ProjectEntity } from '../../domain/entities/project.entity';

export function mapProjectEntityFromDbModel(model: project): ProjectEntity {
  return {
    id: model.id,
    name: model.name,
    matter: model.matter ? model.matter : undefined,
    description: model.description ? model.description : undefined,
    status: model.status as ProjectStatus,
    category: model.category,
    startDate: model.start_date,
    endDate: model.end_date ? model.end_date : undefined,
    totalHours: model.total_hours ? model.total_hours : undefined,
    periodicity: model.periodicity,
    isChargeable: model.is_chargeable,
    area: model.area ? model.area : undefined,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : undefined,
    idCompany: model.id_company,
  };
}
