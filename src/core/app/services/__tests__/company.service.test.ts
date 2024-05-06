import { Decimal } from '@prisma/client/runtime/library';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { SupportedDepartments } from '../../../../utils/enums';
import { CompanyRepository } from '../../../infra/repositories/company.repository';
import { ProjectRepository } from '../../../infra/repositories/project.repository';
import { CompanyService } from '../company.service';

chai.use(chaiAsPromised);

describe('CompanyService', () => {
  let findAllCompaniesStub: sinon.SinonStub;
  let findAllProjectsStub: sinon.SinonStub;
  let updateCompanyStub: sinon.SinonStub;
  let findCompanyByIdStub: sinon.SinonStub;
  let findArchivedCompaniesStub: sinon.SinonStub;

  beforeEach(() => {
    findAllProjectsStub = sinon.stub(ProjectRepository, 'findAll');
    findAllCompaniesStub = sinon.stub(CompanyRepository, 'findAll');
    updateCompanyStub = sinon.stub(CompanyRepository, 'update');
    findCompanyByIdStub = sinon.stub(CompanyRepository, 'findById');
    findArchivedCompaniesStub = sinon.stub(CompanyRepository, 'findArchived');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return an array of all companies', async () => {
    const mockData = prepareMockData();
    findAllProjectsStub.resolves(mockData.existingProjects);
    findAllCompaniesStub.resolves(mockData.existingCompanies);

    const res = await CompanyService.findAll();

    expect(res).to.deep.equal(mockData.existingCompanies);
    expect(res).to.have.lengthOf(2);
  });

  it('should match the name of the companies', async () => {
    const mockData = prepareMockData();
    findAllProjectsStub.resolves(mockData.existingProjects);
    findAllCompaniesStub.resolves(mockData.existingCompanies);

    const res = await CompanyService.findAll();

    expect(res[0].name).to.equal('Zeitgeist');
    expect(res[1].name).to.equal('Microsoft');
  });

  it('should update legal, accounting, chargeable hours, and total projects', async () => {
    const mockData = prepareMockData();
    findAllProjectsStub.resolves(mockData.existingProjects);
    findAllCompaniesStub.resolves(mockData.existingCompanies);

    const res = await CompanyService.findAll();

    expect(res[0].legalHours).to.eql(new Decimal(10));
    expect(res[0].accountingHours).to.eql(new Decimal(5));
    expect(res[0].chargeableHours).to.eql(new Decimal(15));
    expect(res[0].totalProjects).to.eql(2);
  });

  it('should update a company and return the updated entity', async () => {
    const fakeCompany = prepareSingleFakeCompany();
    findCompanyByIdStub.resolves(fakeCompany.original);
    updateCompanyStub.resolves(fakeCompany.updated);

    const result = await CompanyService.update(fakeCompany.updatePayload);

    expect(result).to.deep.equal(fakeCompany.updated);
  });

  it('should get a single company', async () => {
    const idCompany1 = randomUUID();
    const company = {
      id: idCompany1,
      name: 'Zeitgeist',
      email: 'info@zeitgeist.mx',
      phoneNumber: '1234567890',
      landlinePhone: '0987654321',
      archived: false,
      createdAt: new Date(),
      updatedAt: null,
      idCompanyDirectContact: null,
      idForm: null,
    };

    findCompanyByIdStub.resolves(company);
    const aCompany = await CompanyService.findById(idCompany1);

    expect(findCompanyByIdStub.calledWith(idCompany1)).to.be.true;
    expect(aCompany).to.eql(company);
  });

  it('should get all archived companies', async () => {
    const mockData = prepareMockData();
    findArchivedCompaniesStub.resolves(mockData.archivedCompanies);
    findAllProjectsStub.resolves(mockData.existingProjects);

    const res = await CompanyService.findArchived();

    expect(res).to.equal(mockData.archivedCompanies);
    expect(res).to.have.lengthOf(1);
  });
});

function prepareMockData() {
  const idCompany1 = randomUUID();
  const idCompany2 = randomUUID();
  const existingCompanies = [
    {
      id: idCompany1,
      name: 'Zeitgeist',
      email: 'info@zeitgeist.mx',
      phoneNumber: '1234567890',
      landlinePhone: '0987654321',
      archived: false,
      constitutionDate: new Date(),
      rfc: 'ASDF907856RFT',
      taxResidence: 'Epigmenio Gonzalez 123',
      createdAt: new Date(),
      updatedAt: null,
      idCompanyDirectContact: null,
      idForm: null,
    },
    {
      id: idCompany2,
      name: 'Microsoft',
      email: 'info@microsoft.com',
      phoneNumber: '1234567890',
      landlinePhone: '0987654321',
      archived: false,
      constitutionDate: new Date(),
      rfc: 'ASDF907856RFT',
      taxResidence: 'Epigmenio Gonzalez 123',
      createdAt: new Date(),
      updatedAt: null,
      idCompanyDirectContact: null,
      idForm: null,
    },
  ];

  const existingProjects = [
    {
      id: randomUUID(),
      name: 'Zeitgeist P1',
      description: 'Desc',
      status: 'Not started',
      startDate: new Date(),
      totalHours: 10,
      isChargeable: true,
      area: SupportedDepartments.LEGAL,
      createdAt: new Date(),
      idCompany: idCompany1,
    },
    {
      id: randomUUID(),
      name: 'Zeitgeist P2',
      description: 'Desc',
      status: 'Not started',
      startDate: new Date(),
      totalHours: 5,
      isChargeable: true,
      area: SupportedDepartments.ACCOUNTING,
      createdAt: new Date(),
      idCompany: idCompany1,
    },
  ];

  const archivedCompanies = [
    {
      id: idCompany1,
      name: 'Bimbo3',
      email: 'sdlkfjlkd@xn--sdkfj-pta.com',
      phoneNumber: '123456789012345',
      landlinePhone: '7771234567890',
      archived: true,
      constitutionDate: new Date(),
      rfc: 'VECJ880326',
      taxResidence: 'mx',
      createdAt: new Date(),
      updatedAt: null,
      idCompanyDirectContact: null,
      idForm: null,
    },
  ];

  return { existingCompanies, existingProjects, archivedCompanies };
}

function prepareSingleFakeCompany() {
  const fakeId = randomUUID();
  const original = {
    id: fakeId,
    name: 'Old Company Name',
    email: 'oldemail@example.com',
    phoneNumber: '+123456789012',
    landlinePhone: '+123456789012',
    archived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const updated = {
    ...original,
    name: 'New Company Name',
    email: 'newemail@example.com',
  };
  const updatePayload = {
    id: fakeId,
    name: 'New Company Name',
    email: 'newemail@example.com',
    phoneNumber: '+123456789012',
    landlinePhone: '+123456789012',
    archived: false,
  };
  return { original, updated, updatePayload };
}
