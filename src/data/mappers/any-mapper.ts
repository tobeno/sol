import { DataMapper } from './data-mapper';
import { DataTransformation } from '../data-transformation';

export class AnyMapper implements DataMapper<any, any> {
  constructor(readonly mappers: DataMapper<any, any>[]) {}

  supports(input: any, transformation: DataTransformation): boolean {
    return this.mappers.some((mapper) =>
      mapper.supports(input, transformation),
    );
  }

  map(input: any, transformation: DataTransformation) {
    const mapper = this.mappers.find((mapper) =>
      mapper.supports(input, transformation),
    );
    if (mapper) {
      return mapper.map(input, transformation);
    }

    throw new Error(`No mapper supported for transformation ${transformation}`);
  }
}
