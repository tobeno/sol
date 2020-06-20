import { Constructor } from '../interfaces/util';
import { File } from '../storage/file';
import { edit } from '../integrations/editor';

export function WithEdit<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    edit(): File {
      return edit(this);
    }
  };
}
