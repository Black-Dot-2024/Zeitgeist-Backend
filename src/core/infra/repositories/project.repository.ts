import { Prisma } from '../../..';
import { Project } from '../../domain/entities/project.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapProjectEntityFromDbModel } from '../mappers/project-entity-from-db-model-mapper';

const RESOURCE_NAME = 'Project';

async function findProjetsByClientId(clientId: string): Promise<Project[]> {
  try {
    let data = await Prisma.project.findMany({
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

async function findById(id: string): Promise<Project> {
  try {
    let data = await Prisma.project.findUnique({
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

export const ProjectRepository = { findById, findProjetsByClientId };
