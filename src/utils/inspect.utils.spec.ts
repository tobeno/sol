import { inspect } from './inspect.utils';

describe('inspect', () => {
  describe('inspect', () => {
    it('should inspect a value', async () => {
      expect(inspect({ a: 1 })).toEqual('{ a: 1 }');
      expect(inspect('a')).toEqual('a');
      expect(inspect(true)).toEqual('true');
    });
  });
});
