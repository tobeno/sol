import { Constructor } from '../interfaces/util';
import { clipboard } from '../os/fn';

export function WithCopy<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    copy() {
      clipboard.text = String(this);
    }
  };
}
