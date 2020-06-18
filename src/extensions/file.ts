import { Constructor } from '../interfaces/util';
import { File } from '../storage/file';

export function WithFile<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    file(path: string): File {
      const f = new File(path);
      f.text = String(this);
      return f;
    }
  };
}
