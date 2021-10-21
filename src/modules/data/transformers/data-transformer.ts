import { DataTransformation } from '../data-transformation';

export interface DataTransformer<InputType, OutputType> {
  supports(input: InputType, transformation: DataTransformation): boolean;

  transform(input: InputType, transformation: DataTransformation): OutputType;
}
