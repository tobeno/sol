import { File } from '../../../wrappers/file';
import { Text } from '../../../wrappers/text';
import { TmpFile } from '../../../wrappers/tmp-file';

/**
 * Opens the given path or value in the default editor.
 */
export function edit(pathOrValue?: any): File {
  let f: File;

  if (!pathOrValue) {
    f = TmpFile.create('ts');
  } else if (
    typeof pathOrValue === 'string' &&
    /(^\s|\n|\s$)/.test(pathOrValue)
  ) {
    f = TmpFile.create('txt');
    f.text = pathOrValue;
  } else if (pathOrValue instanceof Buffer) {
    f = TmpFile.create();
    f.buffer = pathOrValue;
  } else if (pathOrValue instanceof Text) {
    f = TmpFile.create(pathOrValue.ext);
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

    f = TmpFile.create(ext);
    if (typeof pathOrValue === 'string') {
      f.text = pathOrValue;
    } else {
      f.json = pathOrValue;
    }
  } else {
    f = File.create(pathOrValue);
  }

  f.create();

  f.edit();

  return f;
}
