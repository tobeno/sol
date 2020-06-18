import { Constructor } from '../interfaces/util';
import { File } from '../storage/file';
import { vscode } from '../shell/fn';

export function WithVscode<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    vscode(): File {
      return vscode(this);
    }
  };
}
