import { File, file } from '../storage/file';
import { tmp } from '../storage/tmp';
import { Text } from '../data/text';

export const editor = process.env.SOL_EDITOR || 'code';

export function edit(pathOrValue?: any): File {
  let f: File;

  if (!pathOrValue) {
    f = tmp('ts');
  } else if (
    typeof pathOrValue === 'string' &&
    /(^\s|\n|\s$)/.test(pathOrValue)
  ) {
    f = tmp('txt');
    f.text = pathOrValue;
  } else if (pathOrValue instanceof Text) {
    f = tmp(pathOrValue.ext);
    f.text = pathOrValue;
  } else if (typeof pathOrValue === 'object') {
    let ext = 'json';
    if (pathOrValue.constructor !== Object) {
      if (typeof pathOrValue.ext !== 'undefined') {
        ext = pathOrValue.ext;
      }

      if (typeof pathOrValue.text !== 'undefined') {
        pathOrValue = pathOrValue.text;
      } else if (typeof pathOrValue.data !== 'undefined') {
        pathOrValue = pathOrValue.data;
      }
    }

    f = tmp(ext);
    if (typeof pathOrValue === 'string') {
      f.text = pathOrValue;
    } else {
      f.json = pathOrValue;
    }
  } else {
    f = file(pathOrValue);
  }

  f.create();

  f.edit();

  return f;
}
