/**
 * Base class for all object based wrappers
 */
export abstract class Wrapper<ValueType = any> {
  constructor(public value: ValueType) {}
}
