import { DataType, DataTypeMatchType } from './data-type';

export enum DataTransformationMatchType {
  Exact,
  BasePartial,
  TargetPartial,
  Partial,
}

export class DataTransformation {
  constructor(readonly baseType: DataType, readonly targetType: DataType) {}

  reverse(): DataTransformation {
    return new DataTransformation(this.targetType, this.baseType);
  }

  withBaseType(newBaseType: DataType) {
    return new DataTransformation(newBaseType, this.targetType);
  }

  withTargetType(newTargetType: DataType) {
    return new DataTransformation(this.baseType, newTargetType);
  }

  matches(
    other: DataTransformation,
    matchType: DataTransformationMatchType = DataTransformationMatchType.Exact,
  ) {
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

  toString() {
    return `${this.baseType}:${this.targetType}`;
  }

  /**
   *
   * @param transformation Transformation with format "[SourceType]:[TargetType]" (e.g. "object:string" or "object:string<application/json>")
   */
  static fromString(transformation: string) {
    const [baseType, targetType] = transformation.split(':');

    return new DataTransformation(
      DataType.fromString(baseType),
      DataType.fromString(targetType),
    );
  }
}
