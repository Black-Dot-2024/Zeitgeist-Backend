import { expect } from 'chai';
import { Dummy } from '../../../domain/entities/dummy.entity';
import { findAll } from '../dummy.repository';

describe('DummyRepository', () => {
  describe('findAll', () => {
    it('should return a list of dummy entities when data is found', async () => {
      const result = await findAll();

      expect(result).to.be.an('array').that.is.not.empty;

      result.forEach((dummy: Dummy) => {
        expect(dummy.id).to.match(/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/);
        expect(dummy.name).to.be.a('string');
      });
    });

    it('should throw an error when an unexpected error occurs', async () => {
      findAll = async () => {
        throw new Error('An unexpected error occurred');
      };

      try {
        await findAll();
      } catch (error: any) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('An unexpected error occurred');
      }
    });
  });
});
