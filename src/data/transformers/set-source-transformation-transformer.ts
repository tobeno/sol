import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';
import { Data } from '../data';
import { Text } from '../text';

/**
 * A transformer, which sets the applied transformation in the output
 */
export class SetSourceTransformationTransformer
  implements DataTransformer<any, any> {
  constructor(readonly transformer: DataTransformer<any, any>) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.transformer.supports(input, transformation);
  }

  transform(input: any, transformation: DataTransformation) {
    const output = this.transformer.transform(input, transformation);

    if (output instanceof Data || output instanceof Text) {
      output.sourceTransformation = transformation;
    }

    return output;
  }
}
