import { Constructor } from '../interfaces/util';
import { File } from '../storage/file';

export function WithFile<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    file(pathOrFile: string | File): File {
      const f = pathOrFile instanceof File ? pathOrFile : new File(pathOrFile);
      f.text = String(this);
      return f;
    }
  };
}
