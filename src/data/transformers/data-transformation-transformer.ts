import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';
import { Data } from '../data';
import { Text } from '../text';

/**
 * A mapper, which sets the applied transformation in the output
 */
export class DataTransformationTransformer
  implements DataTransformer<any, any> {
  constructor(readonly mapper: DataTransformer<any, any>) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.mapper.supports(input, transformation);
  }

  transform(input: any, transformation: DataTransformation) {
    const output = this.mapper.transform(input, transformation);

    if (output instanceof Data || output instanceof Text) {
      output.sourceTransformation = transformation;
    }

    return output;
  }
}
