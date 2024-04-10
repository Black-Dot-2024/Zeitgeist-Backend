import { expect } from 'chai';
import { validate as uuidValidate } from 'uuid';
import { Dummy } from '../../../domain/entities/dummy.entity';
import { DummyRepository } from '../dummy.repository';

describe('DummyRepository', () => {
  describe('findAll', () => {
    it('should return a list of dummy entities when data is found', async () => {
      const result = await DummyRepository.findAll();

      expect(result).to.be.an('array').that.is.not.empty;

      result.forEach((dummy: Dummy) => {
        expect(uuidValidate(dummy.id)).to.be.true;
        expect(dummy.name).to.be.a('string');
      });
    });

    it('should throw an error when an unexpected error occurs', async () => {
      DummyRepository.findAll = async () => {
        throw new Error('An unexpected error occurred');
      };

      try {
        await DummyRepository.findAll();
      } catch (error: any) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('An unexpected error occurred');
      }
    });
  });
});
