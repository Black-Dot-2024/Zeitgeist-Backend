import { Prisma } from '../../..';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapProjectEntityFromDbModel } from '../mappers/project-entity-from-db-model.mapper';

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

export const ProjectRepository = { findAll, findProjectStatusById, findById, findProjetsByClientId };
