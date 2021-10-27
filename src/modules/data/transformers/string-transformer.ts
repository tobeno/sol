import { DataType } from '../data-type';
import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';

export abstract class StringTransformer<TargetType>
  implements DataTransformer<any, any>
{
  baseType: DataType;
  stringifyTransformation: DataTransformation;
  parseTransformation: DataTransformation;

  constructor(readonly targetType: DataType, baseFormat: string | null = null) {
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

  abstract stringify(input: TargetType): string;

  abstract parse(input: string): TargetType;

  matchesStringifyTransformation(transformation: DataTransformation): boolean {
    return this.stringifyTransformation.matches(transformation);
  }

  matchesParseTransformation(transformation: DataTransformation): boolean {
    return this.parseTransformation.matches(transformation);
  }

  supports(input: any, transformation: DataTransformation): boolean {
    return (
      this.matchesStringifyTransformation(transformation) ||
      this.matchesParseTransformation(transformation)
    );
  }

  transform(input: any, transformation: DataTransformation): any {
    if (this.matchesStringifyTransformation(transformation)) {
      return this.stringify(input);
    }

    if (this.matchesParseTransformation(transformation)) {
      return this.parse(input);
    }

    throw new Error(`Got unexpected transformation ${transformation}`);
  }
}
