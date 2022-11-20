import { DataTransformation } from '../data-transformation';

/**
 * Interfrace for a transformer for converting data to other types.
 */
export interface DataTransformer<InputType, OutputType> {
  supports(input: InputType, transformation: DataTransformation): boolean;

  transform(input: InputType, transformation: DataTransformation): OutputType;
}
