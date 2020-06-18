import { Constructor } from '../interfaces/util';

export function WithPrint<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    print() {
      console.log(String(this));
    }
  };
}
