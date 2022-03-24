import util from 'util';

export function inspect(output: any): string {
  if (typeof output === 'string') {
    return output;
  }

  return util.inspect(output);
}
