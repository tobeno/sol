import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';
import { Data } from '../data';
import { Text } from '../text';

/**
 * A mapper, which preserves the source of data during mapping
 */
export class DataSourceTransformer implements DataTransformer<any, any> {
  constructor(readonly mapper: DataTransformer<any, any>) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.mapper.supports(input, transformation);
  }

  transform(input: any, transformation: DataTransformation) {
    let source = null;
    if (input instanceof Data || input instanceof Text) {
      source = input.source;
    }

    const output = this.mapper.transform(input, transformation);

    if (output instanceof Data || output instanceof Text) {
      output.source = source;
    }

    return output;
  }
}
