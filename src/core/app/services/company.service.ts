import { randomUUID } from 'crypto';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { CompanyRepository } from '../../infra/repositories/company.repository';
import { UpdateCompanyBody } from '../interfaces/company.interface';
/**
 * Gets all data from a unique company
 * @returns {Promise<CompanyEntity>} a promise that resolves a unique company entity
 * @throws {Error} if an unexpected error occurs
 */

async function findById(id: string): Promise<CompanyEntity> {
  try {
    const companyRecord = await CompanyRepository.findById(id);
    return companyRecord;
  } catch (error: any) {
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Creates a new company
 * @param {CompanyEntity} company data
 * @returns {String} id from created company
 * @returns {null} if an error occured
 * @throws {Error} if an unexpected error occurs
 */

async function create(company: CompanyEntity): Promise<CompanyEntity | null> {
  try {
    const uuid = randomUUID();
    const date = new Date();
    const res = await CompanyRepository.create(company, uuid, date);
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Gets all data from all companies
 * @returns {Promise<CompanyEntity[]>} a promise that resolves to an array of company entities
 * @throws {Error} if an unexpected error occurs
 */

async function findAll(): Promise<CompanyEntity[]> {
  try {
    const companyRecords = await CompanyRepository.findAll();
    return companyRecords;
  } catch (error: any) {
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Update company entity based on id
 * @param {CompanyEntity} company
 * @returns {Promise<CompanyEntity>} a promise that resolves to the updated company entity
 */
async function update(body: UpdateCompanyBody): Promise<CompanyEntity> {
  try {
    const company = await CompanyRepository.findById(body.id);

    if (!company) throw new NotFoundError('Company not found');

    return await CompanyRepository.update({
      id: company.id,
      name: body.name ?? company.name,
      email: body.email,
      phoneNumber: body.phoneNumber,
      landlinePhone: body.landlinePhone,
      archived: body.archived,
      constitutionDate: body.constitutionDate,
      rfc: body.rfc,
      taxResidence: body.taxResidence,
      idCompanyDirectContact: company.idCompanyDirectContact,
      idForm: company.idForm,
      createdAt: company.createdAt,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * @brief Archive a client
 *
 * @param id
 * @returns {Promise<CompanyEntity>}
 */
async function archiveClient(id: string): Promise<CompanyEntity> {
  try {
    const status = await CompanyRepository.getArchivedStatus(id);
    if (status === undefined) {
      throw new Error('Status not found');
    }
    const company = await CompanyRepository.archiveClient(id, status);
    if (!company) {
      throw new Error('Company not found');
    }
    return await CompanyRepository.archiveClient(id, status);
  } catch (error: unknown) {
    throw new Error('An unexpected error occurred');
  }
}

/**
 * @brief Retrieves all companies that are not archived.
 *
 * @returns {Promise<CompanyEntity[]>}
 * @throws {Error} - If an error occurs while retrieving the companies.
 */
async function findUnarchived(): Promise<CompanyEntity[]> {
  try {
    const data = await CompanyRepository.findUnarchived();
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * @brief Delete a client
 *
 * @param id
 * @param email
 * @returns {Promise<CompanyEntity>}
 */
async function deleteCompanyById(id: string): Promise<CompanyEntity> {
  try {
    return await CompanyRepository.deleteCompanyById(id);
  } catch (error: any) {
    if (error.message === 'Company not found') {
      throw new Error('Company not found');
    }
    throw new Error('An unexpected error occurred');
  }
}

export const CompanyService = { findAll, findById, update, create, archiveClient, findUnarchived, deleteCompanyById };
