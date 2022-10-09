/**
 * Base class for all object based wrappers
 */
export abstract class Wrapper<ValueType = any> {
  constructor(public value: ValueType) {}

  as(name: string): this {
    (global as any)[name] = this;

    return this;
  }
}
