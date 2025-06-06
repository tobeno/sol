import { DataType, DataTypeMatchType } from '../../wrappers/data-type.wrapper';

export enum DataTransformationMatchType {
  Exact,
  BasePartial,
  TargetPartial,
  Partial,
}

/**
 * Class for describing a transformation between two data types.
 */
export class DataTransformation {
  constructor(
    readonly baseType: DataType,
    readonly targetType: DataType,
  ) {}

  reverse(): DataTransformation {
    return new DataTransformation(this.targetType, this.baseType);
  }

  withBaseType(newBaseType: DataType): DataTransformation {
    return new DataTransformation(newBaseType, this.targetType);
  }

  withTargetType(newTargetType: DataType): DataTransformation {
    return new DataTransformation(this.baseType, newTargetType);
  }

  matches(
    other: DataTransformation,
    matchType: DataTransformationMatchType = DataTransformationMatchType.Exact,
  ): boolean {
    const baseMatches = this.baseType.matches(
      other.baseType,
      [
        DataTransformationMatchType.Partial,
        DataTransformationMatchType.BasePartial,
      ].includes(matchType)
        ? DataTypeMatchType.Partial
        : DataTypeMatchType.Exact,
    );

    const targetMatches = this.targetType.matches(
      other.targetType,
      [
        DataTransformationMatchType.Partial,
        DataTransformationMatchType.TargetPartial,
      ].includes(matchType)
        ? DataTypeMatchType.Partial
        : DataTypeMatchType.Exact,
    );

    return baseMatches && targetMatches;
  }

  toString(): string {
    return `${this.baseType}:${this.targetType}`;
  }

  /**
   *
   * @param transformation Transformation with format "[SourceType]:[TargetType]" (e.g. "object:string" or "object:string<application/json>")
   */
  static fromString(transformation: string): DataTransformation {
    const [baseType, targetType] = transformation.split(':');
    if (!baseType || !targetType) {
      throw new Error(`Invalid transformation string: ${transformation}`);
    }

    return new DataTransformation(
      DataType.fromString(baseType),
      DataType.fromString(targetType),
    );
  }
}
