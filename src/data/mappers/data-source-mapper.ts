import { DataMapper } from './data-mapper';
import { DataTransformation } from '../data-transformation';
import { Data } from '../data';
import { Text } from '../text';

/**
 * A mapper, which preserves the source of data during mapping
 */
export class DataSourceMapper implements DataMapper<any, any> {
  constructor(readonly mapper: DataMapper<any, any>) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.mapper.supports(input, transformation);
  }

  map(input: any, transformation: DataTransformation) {
    let source = null;
    if (input instanceof Data || input instanceof Text) {
      source = input.source;
    }

    const output = this.mapper.map(input, transformation);

    if (output instanceof Data || output instanceof Text) {
      output.source = source;
    }

    return output;
  }
}
