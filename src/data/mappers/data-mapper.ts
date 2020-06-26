import { DataTransformation } from '../data-transformation';

export interface DataMapper<InputType, OutputType> {
  supports(input: InputType, transformation: DataTransformation): boolean;

  map(input: InputType, transformation: DataTransformation): OutputType;
}
