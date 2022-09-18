import { DataTransformer } from './data.transformer';
import { DataTransformation } from '../data-transformation';

export class AnyTransformer implements DataTransformer<any, any> {
  constructor(readonly transformers: DataTransformer<any, any>[]) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.transformers.some((transformer) =>
      transformer.supports(input, transformation),
    );
  }

  transform(input: any, transformation: DataTransformation): any {
    const transformer = this.transformers.find((currentTransformer) =>
      currentTransformer.supports(input, transformation),
    );
    if (transformer) {
      return transformer.transform(input, transformation);
    }

    throw new Error(
      `No transformer supported for transformation ${transformation}`,
    );
  }
}
