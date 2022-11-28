import { Wrapper } from '../modules/data/wrapper';

export type MaybeWrapped<ValueType> = ValueType | Wrapper<ValueType>;

export type Unwrapped<ValueType> = ValueType extends Wrapper<
  infer UnwrappedType
>
  ? UnwrappedType
  : ValueType;