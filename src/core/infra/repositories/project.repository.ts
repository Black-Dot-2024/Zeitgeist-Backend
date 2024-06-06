import { Decimal } from '@prisma/client/runtime/library';
import { ProjectStatus, SupportedDepartments, SupportedRoles } from '../../../utils/enums';
import { ProjectEntity } from '../../domain/entities/project.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapProjectEntityFromDbModel } from '../mappers/project-entity-from-db-model-mapper';
import { Prisma } from '../providers/prisma.provider';

const RESOURCE_NAME = 'Project info';

/**
 * Retrieves all projects from a certain role, done projects appear last
 * @param role The role from the requester
 * @returns All the projects from the role's department
 */
async function findAllByRole(role: SupportedRoles): Promise<ProjectEntity[]> {
  try {
    const roleToDepartment = {
      [SupportedRoles.ADMIN]: {},
      [SupportedRoles.LEGAL]: { area: { in: [SupportedDepartments.LEGAL, SupportedDepartments.LEGAL_AND_ACCOUNTING] } },
      [SupportedRoles.ACCOUNTING]: {
        area: { in: [SupportedDepartments.ACCOUNTING, SupportedDepartments.LEGAL_AND_ACCOUNTING] },
      },
      [SupportedRoles.WITHOUT_ROLE]: null,
    };

    const departmentCriteria = roleToDepartment[role];
    if (departmentCriteria === null) {
      return [];
    }

    const projects = await Prisma.project.findMany({
      where: {
        ...departmentCriteria,
        status: {
          not: ProjectStatus.DONE,
        },
      },
      orderBy: { status: 'desc' },
    });

    const doneProjects = await Prisma.project.findMany({
      where: {
        ...departmentCriteria,
        status: ProjectStatus.DONE,
      },
      orderBy: { status: 'desc' },
    });

    const allProjects = [...projects, ...doneProjects];
    return allProjects.map(mapProjectEntityFromDbModel);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * Finds a project status by id
 * @version 1.0.0
 * @returns {Promise<ProjectEntity>} a promise that resolves in a string with the project status
 */
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

/**
 * Finds a project by id
 * @version 1.0.0
 * @returns {Promise<ProjectEntity>} a promise that resolves in a project entity.
 */
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
        is_archived: project.isArchived ? project.isArchived : false,
        status: project.status,
        created_at: project.createdAt,
        payed: project.payed,
      },
    });
    return mapProjectEntityFromDbModel(updatedProject);
  } catch (error: any) {
    throw new Error(`${RESOURCE_NAME} repository error: ${error.message}`);
  }
}

/**
 * A function that updates the project status into data base
 * @param projectId ID of the project status to update
 * @param newStatus New project status
 * @returns {Promise<ProjectStatus>} the status updated
 */
async function updateProjectStatus(projectId: string, newStatus: ProjectStatus): Promise<ProjectStatus> {
  try {
    await Prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus },
    });
    return newStatus;
  } catch (error) {
    throw new Error('Error updating project status');
  }
}

/**
 * A function that deletes a project from the database
 * @param id ID of the project to delete
 * @returns {Promise<ProjectEntity>} the deleted project
 * @throws {Error} if the project is not found
 * @throws {Error} if an unexpected error occurs
 *
 */

async function deleteProjectById(id: string): Promise<ProjectEntity> {
  try {
    const data = await Prisma.project.delete({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundError(`${RESOURCE_NAME}`);
    }

    return mapProjectEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME}An unexpected error occurred`);
  }
}

export const ProjectRepository = {
  findProjectStatusById,
  findById,
  findProjetsByClientId,
  createProject,
  updateProject,
  updateProjectStatus,
  findAllByRole,
  deleteProjectById,
};
