import { company } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { CompanyEntity } from '../../domain/entities/company.entity';

export function mapCompanyEntityFromDbModel(model: company): CompanyEntity {
  return {
    id: model.id,
    name: model.name,
    email: model.email ? model.email : null,
    phoneNumber: model.phone_number ? model.phone_number : null,
    landlinePhone: model.landline_phone ? model.landline_phone : null,
    archived: model.archived,
    idCompanyDirectContact: model.id_company_direct_contact ? model.id_company_direct_contact : null,
    idForm: model.id_form ? model.id_form : null,
    createdAt: model.created_at,
    updatedAt: model.updated_at ? model.updated_at : null,
    accountingHours: new Decimal(0),
    legalHours: new Decimal(0),
    chargeableHours: new Decimal(0),
    totalProjects: 0,
  };
}
