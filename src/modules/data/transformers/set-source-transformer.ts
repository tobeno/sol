import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';
import { Data } from '../data';
import { Text } from '../text';

/**
 * A transformer, which preserves the source of data during mapping
 */
export class SetSourceTransformer implements DataTransformer<any, any> {
  constructor(readonly transformer: DataTransformer<any, any>) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.transformer.supports(input, transformation);
  }

  transform(input: any, transformation: DataTransformation) {
    let source = null;
    if (input instanceof Data || input instanceof Text) {
      source = input;
    }

    const output = this.transformer.transform(input, transformation);

    if (output instanceof Data || output instanceof Text) {
      output.source = source;
    }

    return output;
  }
}
