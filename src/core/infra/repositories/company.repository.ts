import { CompanyEntity } from '../../domain/entities/company.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { mapCompanyEntityFromDbModel } from '../mappers/company-entity-from-db-model.mapper';
import { Prisma } from '../providers/prisma.provider';

const RESOURCE_NAME = 'Company';

/**
 * Finds all company entities in the database
 * @version 1.0.0
 * @returns {Promise<CompanyEntity[]>} a promise taht resolves to an array of company entities
 */
async function findAll(): Promise<CompanyEntity[]> {
  try {
    const data: Array<any> = await Prisma.$queryRaw`
      SELECT c.*, 
      COUNT(DISTINCT p.id) as total_projects,
      SUM(CASE WHEN p.is_chargeable THEN t.worked_hours ELSE 0 END) AS chargeable_hours,
      SUM(CASE WHEN p.is_chargeable AND p.area='Accounting' THEN t.worked_hours ELSE 0 END) AS accounting_hours,
      SUM(CASE WHEN p.is_chargeable AND p.area='Legal' THEN t.worked_hours ELSE 0 END) AS legal_hours
      FROM company c
      LEFT JOIN project p ON c.id=p.id_company
      LEFT JOIN task t ON p.id=t.id_project
      GROUP BY c.id
      ORDER BY c.name ASC
    `;

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }
    return data.map(mapCompanyEntityFromDbModel);
  } catch (error: any) {
    throw new Error(`${RESOURCE_NAME} repository error: ${error.message}`);
  }
}

/**
 * Creates a new company in the database
 * @version 1.0.0
 * @param {CompanyEntity} company data
 * @returns {String} id from created company
 * @returns {null} if an error occured
 */

async function create(company: CompanyEntity, uuid: string, date: Date): Promise<CompanyEntity | null> {
  try {
    const res = await Prisma.company.create({
      data: {
        id: uuid,
        name: company.name,
        email: company.email,
        phone_number: company.phoneNumber,
        landline_phone: company.landlinePhone,
        archived: false,
        constitution_date: company.constitutionDate ? new Date(company.constitutionDate) : null,
        rfc: company.rfc,
        tax_residence: company.taxResidence,
        id_company_direct_contact: company.idCompanyDirectContact,
        id_form: company.idForm,
        created_at: date,
        updated_at: null,
      },
    });
    return mapCompanyEntityFromDbModel(res);
  } catch (error: any) {
    // P2002 = Prisma Error code for unique constraints
    if (error.code == 'P2002') {
      if (error.meta.target[0] == 'email') throw new Error('Email already registered.');
    }
    if (error.meta.target[0] == 'rfc') throw new Error('RFC already registered.');
    throw new Error(error);
  }
}

async function findById(id: string): Promise<CompanyEntity> {
  try {
    const data = await Prisma.company.findUnique({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapCompanyEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * @brief gets the status
 *
 * @param id
 *
 * @returns {boolean} from company
 * @returns {undefined} because it can be
 */
async function getArchivedStatus(id: string): Promise<boolean | undefined> {
  try {
    const data = await Prisma.company.findUnique({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapCompanyEntityFromDbModel(data).archived;
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

/**
 * @brief gets the status
 *
 * @param id
 * @param archived
 * @returns {Promise<CompanyEntity>}
 */
async function archiveClient(id: string, archived: boolean): Promise<CompanyEntity> {
  try {
    const data = await Prisma.company.update({
      where: {
        id: id,
      },
      data: {
        archived: !archived,
      },
    });
    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapCompanyEntityFromDbModel(data);
  } catch (error: unknown) {
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

async function update(company: CompanyEntity): Promise<CompanyEntity> {
  try {
    const updatedCompany = await Prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        name: company.name,
        email: company.email,
        phone_number: company.phoneNumber,
        landline_phone: company.landlinePhone,
        archived: company.archived,
        constitution_date: company.constitutionDate ? new Date(company.constitutionDate) : null,
        rfc: company.rfc,
        tax_residence: company.taxResidence,
        id_company_direct_contact: company.idCompanyDirectContact,
        id_form: company.idForm,
        updated_at: company.updatedAt,
      },
    });

    return mapCompanyEntityFromDbModel(updatedCompany);
  } catch (error: any) {
    if (error.code == 'P2002' && (error.meta?.target as string[])[0] === 'email')
      throw new Error('Email already registered.');
    throw new Error(`${RESOURCE_NAME} repository error: ${error.message}`);
  }
}

/**
 * @brief deletes a company by id
 *
 * @param id
 * @returns {Promise<CompanyEntity>}
 */

async function deleteCompanyById(id: string): Promise<CompanyEntity> {
  try {
    const data = await Prisma.company.delete({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundError(RESOURCE_NAME);
    }

    return mapCompanyEntityFromDbModel(data);
  } catch (error: unknown) {
    console.error(error);
    throw new Error(`${RESOURCE_NAME} repository error`);
  }
}

export const CompanyRepository = {
  findAll,
  findById,
  update,
  create,
  archiveClient,
  getArchivedStatus,
  deleteCompanyById,
};
