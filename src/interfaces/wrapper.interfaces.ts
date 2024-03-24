import { Wrapper } from '../wrappers/wrapper.wrapper';

export type MaybeWrapped<ValueType> = ValueType | Wrapper<ValueType>;

export type Unwrapped<ValueType> =
  ValueType extends Wrapper<infer UnwrappedType> ? UnwrappedType : ValueType;
