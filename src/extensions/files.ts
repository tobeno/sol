import { Constructor } from '../interfaces/util';
import { ClassWithFiles } from '../interfaces/base';

export function WithFiles<T extends Constructor<ClassWithFiles>>(base: T) {
  return class Wrapped extends base {};
}
