import { unwrapDeep } from '../utils/data.utils';

/**
 * Base class for all object based wrappers.
 */
export class Wrapper<ValueType = any> {
  constructor(public value: ValueType) {}

  /**
   * Stores this in a variable with the given name.
   */
  var(name: string): this {
    (global as any)[name] = this;

    return this;
  }

  /**
   * Returns the value fully unwrapped.
   */
  get unwrapped(): any {
    return unwrapDeep(this.value);
  }
}
