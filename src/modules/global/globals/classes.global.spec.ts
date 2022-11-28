import * as classes from './classes.global';

describe('classes global', () => {
  describe('health', () => {
    it('should export valid classes', async () => {
      Object.values(classes).forEach((cls) => {
        expect(cls).toBeTruthy();
      });
    });
  });
});
