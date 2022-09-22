export enum DataTypeMatchType {
  Exact,
  Partial,
}

export class DataType {
  static Array = DataType.fromString('Array');
  static Ast = DataType.fromString('Ast');
  static Data = DataType.fromString('Data');
  static Date = DataType.fromString('Date');
  static Html = DataType.fromString('Html');
  static Markdown = DataType.fromString('Markdown');
  static Object = DataType.fromString('object');
  static String = DataType.fromString('string');
  static Text = DataType.fromString('Text');
  static Xml = DataType.fromString('Xml');
  static Url = DataType.fromString('Url');

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

  toString(): string {
    return this.format ? `${this.type}<${this.format}>` : this.type;
  }

  /**
   * @param fullType Data type with format "[Type](<[format]>)" (e.g. "Text<application/json>")
   */
  static fromString(fullType: string): DataType {
    const match = fullType.match(/^(.+?)(\<(.+)\>)?$/);
    if (!match) {
      throw new Error(`Invalid type ${fullType}`);
    }

    const [, type, , format = null] = match;

    return new DataType(type, format);
  }
}
