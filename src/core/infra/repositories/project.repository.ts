import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '../../..';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapProjectEntityFromDbModel } from '../mappers/project-entity-from-db-model-mapper';

const RESOURCE_NAME = 'Project info';

/**
 * Finds all company entities in the database
 * @version 1.0.0
 * @returns {Promise<ProjectEntity[]>} a promise taht resolves to an array of company entities
 */

async function findAll(): Promise<ProjectEntity[]> {
  try {
    const data = await Prisma.project.findMany();
    if (!data) throw new NotFoundError(`${RESOURCE_NAME} error`);

    return data.map(mapProjectEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

async function findProjectStatusById(id: string) {
  try {
    const data = await Prisma.project.findUnique({
      where: {
        id: id,
      },
      select: {
        status: true,
      },
    });

    if (!data) {
      throw new NotFoundError(`${RESOURCE_NAME} status`);
    }

    return data;
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

async function findById(id: string): Promise<ProjectEntity> {
  try {
    const data = await Prisma.project.findUnique({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapProjectEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Finds all projects in the database form a unique company
 * @version 1.1.0
 * @returns {Promise<ProjectEntity[]>} a promise that resolves an array of project entities ordering the projects with status done at the end.
 */

async function findProjetsByClientId(clientId: string): Promise<ProjectEntity[]> {
  try {
    const data = await Prisma.project.findMany({
      where: {
        id_company: clientId,
      },
    });

    if (!data) {
      throw new Error(`${RESOURCE_NAME} repository error`);
    }
    return data.map(mapProjectEntityFromDbModel);
  } catch (error: any) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * A function that calls the Prisma interface to create a project
 * @param entity A backend defined project entity, mapped from the db
 * @returns The created entity mapped from the db response
 */
async function createProject(entity: ProjectEntity): Promise<ProjectEntity> {
  const createData = await Prisma.project.create({
    data: {
      id: entity.id,
      name: entity.name,
      matter: entity.matter,
      description: entity.description,
      status: entity.status,
      category: entity.category,
      start_date: entity.startDate,
      end_date: entity.endDate,
      total_hours: entity.totalHours ? new Decimal(entity.totalHours.toString()) : null,
      periodicity: entity.periodicity,
      is_chargeable: entity.isChargeable,
      is_archived: entity.isArchived,
      area: entity.area,
      created_at: entity.createdAt,
      id_company: entity.idCompany,
    },
  });

  return mapProjectEntityFromDbModel(createData);
}

/**
 * A function that calls the Prisma interface to update a project
 * @param {ProjectEntity} project data to update
 * @returns {Promise<ProjectEntity>} project updated
 * @throws {Error}
 */
async function updateProject(project: ProjectEntity): Promise<ProjectEntity> {
  try {
    const updatedProject = await Prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        name: project.name,
        id_company: project.idCompany,
        category: project.category,
        matter: project.matter,
        description: project.description,
        start_date: project.startDate,
        end_date: project.endDate,
        periodicity: project.periodicity,
        area: project.area,
        is_chargeable: project.isChargeable,
        status: project.status,
        created_at: project.createdAt,
      },
    });
    return mapProjectEntityFromDbModel(updatedProject);
  } catch (error: any) {
    throw new Error(`${RESOURCE_NAME} repository error: ${error.message}`);
  }
}

export const ProjectRepository = {
  findAll,
  findProjectStatusById,
  findById,
  findProjetsByClientId,
  createProject,
  updateProject,
};
