import { execCommand } from './shell.utils';

describe('sh', () => {
  describe('execCommand', () => {
    it('should exec the shell command', async () => {
      const result = execCommand('echo "hello"');
      expect(result.value).toBe('hello');
    });
  });
});
