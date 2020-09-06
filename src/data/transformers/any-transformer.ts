import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';

export class AnyTransformer implements DataTransformer<any, any> {
  constructor(readonly transformer: DataTransformer<any, any>[]) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.transformer.some((mapper) =>
      mapper.supports(input, transformation),
    );
  }

  transform(input: any, transformation: DataTransformation) {
    const mapper = this.transformer.find((mapper) =>
      mapper.supports(input, transformation),
    );
    if (mapper) {
      return mapper.transform(input, transformation);
    }

    throw new Error(`No mapper supported for transformation ${transformation}`);
  }
}
