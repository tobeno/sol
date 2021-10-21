import * as util from 'util';

export function inspect(output: any) {
  if (typeof output === 'string') {
    return output;
  }

  return util.inspect(output);
}
