import { unwrapDeep } from '../utils/wrapper.utils';

/**
 * Base class for all object based wrappers.
 */
export class Wrapper<ValueType = any> {
  constructor(public value: ValueType) {}

  /**
   * Stores this in a variable with the given name.
   */
  var(name: string): this {
    if (!(global as any).vars) {
      (global as any).vars = {};
    }

    (global as any).vars[name] = this;

    return this;
  }

  /**
   * Returns the value fully unwrapped.
   */
  get unwrapped(): any {
    return unwrapDeep(this.value);
  }
}
