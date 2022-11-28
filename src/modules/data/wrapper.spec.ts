import { Wrapper } from './wrapper';

describe('Wrapper', () => {
  describe('var', () => {
    it('should assign the wrapper to a variable', async () => {
      const wrapper = new Wrapper('Hello World');
      wrapper.var('someVariable');
      expect((global as any).someVariable).toBe(wrapper);
    });
  });

  describe('unwrapped', () => {
    it('should return the value fully unwrapped', async () => {
      const wrapper = new Wrapper('Hello World');
      expect(wrapper.unwrapped).toBe('Hello World');
    });

    it('should return the value fully unwrapped if nested', async () => {
      const wrapper = new Wrapper([new Wrapper('Hello World'), 'Hello World']);
      expect(wrapper.unwrapped).toEqual(['Hello World', 'Hello World']);
    });
  });
});
