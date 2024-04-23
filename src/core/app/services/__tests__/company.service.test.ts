import { Decimal } from '@prisma/client/runtime/library';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { randomUUID } from 'crypto';
import sinon from 'sinon';
import { CompanyRepository } from '../../../infra/repositories/company.repository';
import { ProjectRepository } from '../../../infra/repositories/project.repository';
import { CompanyService } from '../company.services';

chai.use(chaiAsPromised);

describe('CompanyService', () => {
  let findAllCompaniesStub: sinon.SinonStub;
  let findAllProjectsStub: sinon.SinonStub;

  beforeEach(() => {
    findAllProjectsStub = sinon.stub(ProjectRepository, 'findAll');
    findAllCompaniesStub = sinon.stub(CompanyRepository, 'findAll');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return an array of all companies', async () => {
    const idCompany1 = randomUUID();
    const idCompany2 = randomUUID();
    const idProject1 = randomUUID();
    const idProject2 = randomUUID();
    const idProject3 = randomUUID();
    const idProject4 = randomUUID();

    const existingCompanies = [
      {
        id: idCompany1,
        name: 'Zeitgeist',
        email: 'info@zeitgeist.mx',
        phoneNumnber: '1234567890',
        landline_phone: '0987654321',
        archived: false,
        createdAt: new Date(),
        updatedAt: null,
        idCompanyDirectContact: null,
        idForm: null,
      },
      {
        id: idCompany2,
        name: 'Microsoft',
        email: 'info@microsoft.com',
        phoneNumnber: '1234567890',
        landline_phone: '0987654321',
        archived: false,
        createdAt: new Date(),
        updatedAt: null,
        idCompanyDirectContact: null,
        idForm: null,
      },
    ];

    const existingProjects = [
      {
        id: idProject1,
        name: 'Zeitgeist P1',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 10,
        periodicity: null,
        isChargeable: true,
        area: 'LEGAL',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject2,
        name: 'Zeitgeist P2',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 5,
        periodicity: null,
        isChargeable: true,
        area: 'CONTABLE',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject3,
        name: 'Zeitgeist P3',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 15,
        periodicity: null,
        isChargeable: true,
        area: 'CONTABLE',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject4,
        name: 'Zeitgeist P4',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 10,
        periodicity: null,
        isChargeable: false,
        area: 'LEGAL',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
    ];

    findAllProjectsStub.resolves(existingProjects);
    findAllCompaniesStub.resolves(existingCompanies);

    const res = await CompanyService.findAll();

    expect(res).to.deep.equal(existingCompanies);
    expect(res).length(2);
  });

  it('should match the name of the companies', async () => {
    const idCompany1 = randomUUID();
    const idCompany2 = randomUUID();
    const idProject1 = randomUUID();
    const idProject2 = randomUUID();
    const idProject3 = randomUUID();
    const idProject4 = randomUUID();

    const existingCompanies = [
      {
        id: idCompany1,
        name: 'Zeitgeist',
        email: 'info@zeitgeist.mx',
        phoneNumnber: '1234567890',
        landline_phone: '0987654321',
        archived: false,
        createdAt: new Date(),
        updatedAt: null,
        idCompanyDirectContact: null,
        idForm: null,
      },
      {
        id: idCompany2,
        name: 'Microsoft',
        email: 'info@microsoft.com',
        phoneNumnber: '1234567890',
        landline_phone: '0987654321',
        archived: false,
        createdAt: new Date(),
        updatedAt: null,
        idCompanyDirectContact: null,
        idForm: null,
      },
    ];

    const existingProjects = [
      {
        id: idProject1,
        name: 'Zeitgeist P1',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 10,
        periodicity: null,
        isChargeable: true,
        area: 'LEGAL',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject2,
        name: 'Zeitgeist P2',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 5,
        periodicity: null,
        isChargeable: true,
        area: 'CONTABLE',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject3,
        name: 'Zeitgeist P3',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 15,
        periodicity: null,
        isChargeable: true,
        area: 'CONTABLE',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject4,
        name: 'Zeitgeist P4',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 10,
        periodicity: null,
        isChargeable: false,
        area: 'LEGAL',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
    ];

    findAllProjectsStub.resolves(existingProjects);
    findAllCompaniesStub.resolves(existingCompanies);

    const res = await CompanyService.findAll();

    expect(res[0].name).to.eql('Zeitgeist');
    expect(res[1].name).to.eql('Microsoft');
  });

  it('should update legal, accounting and chargeable hours, and total projects', async () => {
    const idCompany1 = randomUUID();
    const idCompany2 = randomUUID();
    const idProject1 = randomUUID();
    const idProject2 = randomUUID();
    const idProject3 = randomUUID();
    const idProject4 = randomUUID();

    const existingCompanies = [
      {
        id: idCompany1,
        name: 'Zeitgeist',
        email: 'info@zeitgeist.mx',
        phoneNumnber: '1234567890',
        landline_phone: '0987654321',
        archived: false,
        createdAt: new Date(),
        updatedAt: null,
        idCompanyDirectContact: null,
        idForm: null,
      },
      {
        id: idCompany2,
        name: 'Microsoft',
        email: 'info@microsoft.com',
        phoneNumnber: '1234567890',
        landline_phone: '0987654321',
        archived: false,
        createdAt: new Date(),
        updatedAt: null,
        idCompanyDirectContact: null,
        idForm: null,
      },
    ];

    const existingProjects = [
      {
        id: idProject1,
        name: 'Zeitgeist P1',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 10,
        periodicity: null,
        isChargeable: true,
        area: 'LEGAL',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject2,
        name: 'Zeitgeist P2',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 5,
        periodicity: null,
        isChargeable: true,
        area: 'CONTABLE',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject3,
        name: 'Zeitgeist P3',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 15,
        periodicity: null,
        isChargeable: true,
        area: 'CONTABLE',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
      {
        id: idProject4,
        name: 'Zeitgeist P4',
        matter: null,
        description: 'Desc',
        status: 'Not started',
        category: 'null',
        startDate: new Date(),
        endDate: null,
        totalHours: 10,
        periodicity: null,
        isChargeable: false,
        area: 'LEGAL',
        createdAt: new Date(),
        updatedAt: null,
        idCompany: idCompany1,
      },
    ];

    findAllProjectsStub.resolves(existingProjects);
    findAllCompaniesStub.resolves(existingCompanies);

    const res = await CompanyService.findAll();

    expect(res[0].legalHours).to.eql(new Decimal(10));
    expect(res[0].accountingHours).to.eql(new Decimal(20));
    expect(res[0].chargeableHours).to.eql(new Decimal(30));
    expect(res[0].totalProjects).to.eql(4);
  });
});
