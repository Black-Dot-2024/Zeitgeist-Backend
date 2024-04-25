import { expect } from 'chai';
import { randomUUID } from 'crypto';
import sinon, { SinonStubbedInstance } from 'sinon';
import { ProjectStatus } from '../../../../utils/enums';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../infra/repositories/project.repository';
import { ProjectService } from '../project.service';

describe('ProjectService', () => {
  let projectService: typeof ProjectService;
  let projectRepository: SinonStubbedInstance<typeof ProjectRepository>;

  beforeEach(() => {
    projectRepository = sinon.stub(ProjectRepository);
    projectService = {
      ...ProjectService,
      findProjectsClient: projectRepository.findProjetsByClientId,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('findProjectsByClientId', () => {
    it('Should get the projects of a client with the given id', async () => {
      const clientId = '3ea24e0c-519e-46d8-a45e-62bc5fcbada0';
      const projects: ProjectEntity[] = [
        {
          id: randomUUID(),
          name: 'Nuevo Proyecto de Desarrollo',
          matter: 'Desarrollo de un sistema de gestión interna',
          description:
            'Este proyecto consiste en el desarrollo de un sistema de gestión interna para mejorar los procesos administrativos.',
          status: ProjectStatus.IN_PROCESS,
          category: 'Government',
          startDate: new Date('2023-04-01T00:00:00.000Z'),
          endDate: new Date('2023-12-01T00:00:00.000Z'),
          periodicity: '1 week',
          isChargeable: true,
          area: 'Client',
          createdAt: new Date('2024-04-19T01:23:49.555Z'),
          idCompany: clientId,
        },
      ];

      projectRepository.findProjetsByClientId.withArgs(clientId).returns(Promise.resolve(projects));

      const result = await projectService.findProjectsClient(clientId);

      expect(result).to.deep.equal(projects);
      expect(projectRepository.findProjetsByClientId.calledOnceWithExactly(clientId)).to.be.true;
    });

    it("Should throw an error if the projects couldn't be found", async () => {
      const clientId = '3ea24e0c-519e-46d8-a45e-62bc5fcbada0';

      projectRepository.findProjetsByClientId.withArgs(clientId).throws(new Error('Error getting projects'));

      try {
        await projectService.findProjectsClient(clientId);
      } catch (error: any) {
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.be.equal('Error getting projects');
      }
    });
  });
});
