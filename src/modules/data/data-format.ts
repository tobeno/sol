export class DataFormat {
  static Csv = 'text/csv';
  static Html = 'text/html';
  static Json = 'application/json';
  static Yaml = 'text/x-yaml';
  static Xml = 'text/xml';
  static TextDate = 'text/x-date';
  static TextNewlineSeparated = 'text/x-newline-separated';
  static TextCommaSeparated = 'text/x-comma-separated';
  static TextSemicolonSeparated = 'text/x-semicolon-separated';

  static toExt(format: string | null): string {
    switch (format) {
      case DataFormat.Json:
        return 'json';
      case DataFormat.Csv:
        return 'csv';
      case DataFormat.Html:
        return 'html';
      case DataFormat.Yaml:
        return 'yaml';
      case DataFormat.Xml:
        return 'xml';
      case DataFormat.TextNewlineSeparated:
        return 'json';
      case DataFormat.TextDate:
        return 'date';
      default:
        return 'txt';
    }
  }
}
