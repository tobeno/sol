/**
 * Base class for all object based wrappers.
 */
export abstract class Wrapper<ValueType = any> {
  constructor(public value: ValueType) {}

  /**
   * Stores this in a variable with the given name.
   */
  as(name: string): this {
    (global as any)[name] = this;

    return this;
  }
}
