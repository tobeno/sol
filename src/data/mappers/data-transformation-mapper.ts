import { DataMapper } from './data-mapper';
import { DataTransformation } from '../data-transformation';
import { Data } from '../data';
import { Text } from '../text';

/**
 * A mapper, which sets the applied transformation in the output
 */
export class DataTransformationMapper implements DataMapper<any, any> {
  constructor(readonly mapper: DataMapper<any, any>) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.mapper.supports(input, transformation);
  }

  map(input: any, transformation: DataTransformation) {
    const output = this.mapper.map(input, transformation);

    if (output instanceof Data || output instanceof Text) {
      output.sourceTransformation = transformation;
    }

    return output;
  }
}
