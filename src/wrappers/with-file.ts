import { Constructor } from '../interfaces/util';
import { file, File } from '../storage/file';
import { tmp } from '../storage/tmp';

export function WithFile<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    file(pathOrFile?: string | File): File {
      const thisGeneric = this as any;

      let f;
      if (!pathOrFile) {
        let ext = undefined;

        if (typeof thisGeneric.ext !== 'undefined') {
          ext = thisGeneric.ext;
        }

        f = tmp(ext);
      } else if (pathOrFile instanceof File) {
        f = pathOrFile;
      } else {
        f = file(pathOrFile);
      }

      let text;
      if (typeof thisGeneric.text !== 'undefined') {
        text = thisGeneric.text;
      } else {
        text = String(this);
      }

      f.text = text;
      return f;
    }
  };
}
