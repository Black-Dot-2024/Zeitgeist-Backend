import { Decimal } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';
import { SupportedDepartments } from '../../../utils/enums';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { NotFoundError } from '../../errors/not-found.error';
import { CompanyRepository } from '../../infra/repositories/company.repository';
import { ProjectRepository } from '../../infra/repositories/project.repository';
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
    const projectRecords = await ProjectRepository.findAll();

    companyRecords.map(company => {
      company.totalProjects ??= 0;
      company.accountingHours ??= new Decimal(0);
      company.legalHours ??= new Decimal(0);
      company.chargeableHours ??= new Decimal(0);

      projectRecords.forEach(project => {
        if (project.idCompany == company.id)
          // Add to total projects
          company.totalProjects! += 1;

        if (project.idCompany == company.id && project.isChargeable && project.totalHours) {
          // Add to legal hours
          if (project.area == SupportedDepartments.LEGAL)
            company.legalHours = company.legalHours!.add(new Decimal(project.totalHours.toString()));
          // Add to accounting hours
          if (project.area == SupportedDepartments.ACCOUNTING)
            company.accountingHours = company.accountingHours!.add(new Decimal(project.totalHours.toString()));
        }
      });

      // Add to chargeable hours
      company.chargeableHours = company.chargeableHours.add(company.legalHours).add(company.accountingHours);
    });

    return companyRecords;
  } catch (error: any) {
    throw new Error('an unexpected error occurred');
  }
}

/**
 * Update company entity based on id
 * @param {CompanyEntity} company
 * @returns {Promise<CompanyEntity>} a promise that resolves to the updated company entity
 */
async function update(body: UpdateCompanyBody): Promise<CompanyEntity> {
  const company = await CompanyRepository.findById(body.id);

  if (!company) throw new NotFoundError('Company not found');

  return await CompanyRepository.update({
    id: company.id,
    name: body.name ?? company.name,
    email: body.email ?? company.email,
    phoneNumber: body.phoneNumber ?? company.phoneNumber,
    landlinePhone: body.landlinePhone ?? company.landlinePhone,
    archived: body.archived,
    constitutionDate: body.constitutionDate ?? company.constitutionDate,
    rfc: body.rfc ?? company.rfc,
    taxResidence: body.taxResidence ?? company.taxResidence,
    idCompanyDirectContact: company.idCompanyDirectContact,
    idForm: company.idForm,
    createdAt: company.createdAt,
    updatedAt: new Date(),
  });
}

/**
 * Gets all data from archived companies
 * @returns {Promise<CompanyEntity[]>} a promise that resolves to an array of company entities
 * @throws {Error} if an unexpected error occurs
 */

async function findArchived(): Promise<CompanyEntity[]> {
  try {
    const companyRecords = await CompanyRepository.findArchived();
    const projectRecords = await ProjectRepository.findAll();

    companyRecords.map(company => {
      company.totalProjects ??= 0;
      company.accountingHours ??= new Decimal(0);
      company.legalHours ??= new Decimal(0);
      company.chargeableHours ??= new Decimal(0);

      projectRecords.forEach(project => {
        if (project.idCompany == company.id)
          // Add to total projects
          company.totalProjects! += 1;

        if (project.idCompany == company.id && project.isChargeable && project.totalHours) {
          // Add to legal hours
          if (project.area == SupportedDepartments.LEGAL)
            company.legalHours = company.legalHours!.add(new Decimal(project.totalHours.toString()));
          // Add to accounting hours
          if (project.area == SupportedDepartments.ACCOUNTING)
            company.accountingHours = company.accountingHours!.add(new Decimal(project.totalHours.toString()));
        }
      });

      // Add to chargeable hours
      company.chargeableHours = company.chargeableHours.add(company.legalHours).add(company.accountingHours);
    });

    return companyRecords;
  } catch (error: any) {
    throw new Error('an unexpected error occurred');
  }
}

export const CompanyService = { findAll, findById, update, create, findArchived };
