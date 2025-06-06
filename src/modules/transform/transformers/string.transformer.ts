import { DataType } from '../../../wrappers/data-type.wrapper';
import { DataTransformation } from '../data-transformation';
import type { DataTransformer } from './data.transformer';

/**
 * Base class for transformers for converting from and to strings.
 */
export abstract class StringTransformer<TargetType>
  implements DataTransformer<any, any>
{
  baseType: DataType;
  stringifyTransformation: DataTransformation;
  parseTransformation: DataTransformation;

  constructor(
    readonly targetType: DataType,
    baseFormat: string | null = null,
  ) {
    this.baseType = new DataType('string', baseFormat);
    this.stringifyTransformation = new DataTransformation(
      targetType,
      this.baseType,
    );
    this.parseTransformation = new DataTransformation(
      this.baseType,
      targetType,
    );
  }

  abstract stringify(
    input: TargetType,
    transformation: DataTransformation,
  ): string;

  abstract parse(input: string, transformation: DataTransformation): TargetType;

  matchesStringifyTransformation(transformation: DataTransformation): boolean {
    return this.stringifyTransformation.matches(transformation);
  }

  matchesParseTransformation(transformation: DataTransformation): boolean {
    return this.parseTransformation.matches(transformation);
  }

  supports(_input: any, transformation: DataTransformation): boolean {
    return (
      this.matchesStringifyTransformation(transformation) ||
      this.matchesParseTransformation(transformation)
    );
  }

  transform(input: any, transformation: DataTransformation): any {
    if (this.matchesStringifyTransformation(transformation)) {
      return this.stringify(input, transformation);
    }

    if (this.matchesParseTransformation(transformation)) {
      return this.parse(input, transformation);
    }

    throw new Error(`Got unexpected transformation ${transformation}`);
  }
}
