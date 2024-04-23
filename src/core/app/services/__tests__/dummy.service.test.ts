import chai from 'chai';

const expect = chai.expect;

describe('DummyService', () => {
  describe('getData', () => {
    it('should not do anything complex', async () => {
      // Arrange
      let simpleTruth = true;

      // Act
      let result = true;

      // Assert
      expect(result).to.equal(simpleTruth);
    });
  });
});
