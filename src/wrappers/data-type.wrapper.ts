export enum DataTypeMatchType {
  Exact,
  Partial,
}

/**
 * Data types as used in Sol.
 */
export class DataType {
  static Array = DataType.fromString('Array');
  static Ast = DataType.fromString('Ast');
  static Data = DataType.fromString('Data');
  static Date = DataType.fromString('Date');
  static Html = DataType.fromString('Html');
  static Markdown = DataType.fromString('Markdown');
  static Graph = DataType.fromString('Graph');
  static Object = DataType.fromString('object');
  static String = DataType.fromString('string');
  static Text = DataType.fromString('Text');
  static Xml = DataType.fromString('Xml');
  static Url = DataType.fromString('Url');

  constructor(
    readonly type: string,
    readonly format: string | null = null,
  ) {}

  /**
   * Returns true if the given data type matches this one.
   */
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

  /**
   * Returns the data type with the format removed.
   */
  withoutFormat(): DataType {
    return new DataType(this.type);
  }

  /**
   * Returns the data type with the given format set.
   */
  withFormat(newFormat: string | null): DataType {
    return new DataType(this.type, newFormat);
  }

  toString(): string {
    return this.format ? `${this.type}<${this.format}>` : this.type;
  }

  /**
   * Creates the data type from the given string.
   *
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
