export enum DataTypeMatchType {
  Exact,
  Partial,
}

export class DataType {
  static Array = DataType.fromString('Array');
  static Ast = DataType.fromString('Ast');
  static Data = DataType.fromString('Data');
  static Html = DataType.fromString('Html');
  static Object = DataType.fromString('object');
  static String = DataType.fromString('string');
  static Text = DataType.fromString('Text');
  static Xml = DataType.fromString('Xml');

  constructor(readonly type: string, readonly format: string | null = null) {}

  matches(
    other: DataType,
    matchType: DataTypeMatchType = DataTypeMatchType.Exact,
  ): boolean {
    if (this.type !== other.type) {
      return false;
    }

    if (matchType === DataTypeMatchType.Partial) {
      return true;
    }

    return this.format === other.format;
  }

  withoutFormat(): DataType {
    return new DataType(this.type);
  }

  withFormat(newFormat: string | null): DataType {
    return new DataType(this.type, newFormat);
  }

  toString() {
    return this.format ? `${this.type}<${this.format}>` : this.type;
  }

  static fromString(fullType: string) {
    const match = fullType.match(/(.+)(\<(.+)\>)?/);
    if (!match) {
      throw new Error(`Invalid type ${fullType}`);
    }

    const [, type, format = null] = match;

    return new DataType(type, format);
  }
}
