import { AnyMapper } from './mappers/any-mapper';
import { DataTransformation } from './data-transformation';
import { WrappingMapper } from './mappers/wrapping-mapper';
import { Data } from './data';
import { DataType } from './data-type';
import { DataFormat } from './data-format';
import { CsvMapper } from './mappers/csv-mappers';
import { JsonMapper } from './mappers/json-mappers';
import { YamlMapper } from './mappers/yaml-mappers';
import { HtmlMapper } from './mappers/html-mappers';
import { XmlMapper } from './mappers/xml-mappers';
import { TextCommaSeparatedMapper } from './mappers/text-comma-separated-mapper';
import { TextNewlineSeparatedMapper } from './mappers/text-newline-separated-mapper';
import { TextSemicolonSeparatedMapper } from './mappers/text-semicolon-separated-mapper';
import { ToStringMapper } from './mappers/tostring-mapper';
import { Html } from './html';
import { Xml } from './xml';
import { Text } from './text';
import { TextMapper } from './mappers/text-mapper';
import { DataSourceMapper } from './mappers/data-source-mapper';
import { DataSource } from './data-source';
import { DataTransformationMapper } from './mappers/data-transformation-mapper';
import { Ast } from './ast';
import { AstMapper } from './mappers/ast-mapper';

const anyMapper = new AnyMapper([
  new AstMapper(),
  new CsvMapper(),
  new JsonMapper(),
  new YamlMapper(),
  new HtmlMapper(),
  new XmlMapper(),
  new TextMapper(),
  new TextCommaSeparatedMapper(),
  new TextNewlineSeparatedMapper(),
  new TextSemicolonSeparatedMapper(),
  new ToStringMapper(),
]);
export const mapper = new DataTransformationMapper(
  new DataSourceMapper(new WrappingMapper(Data, anyMapper)),
);

export function map(
  input: any,
  transformation: DataTransformation | string,
): any {
  if (typeof transformation === 'string') {
    transformation = DataTransformation.fromString(transformation);
  }

  return mapper.map(input, transformation);
}

export function jsonToData(
  value: string | String,
  source: DataSource | null = null,
): Data {
  source = source || (value as any).source || null;

  return map(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Json),
      DataType.Data,
    ),
  ).withSource(source);
}

export function dataToJson(
  value: Data | any,
  source: DataSource | null = null,
): Text {
  if (!(value instanceof Data)) {
    value = new Data(value);
  }

  source = source || value.source;

  return wrapString(
    map(
      value,
      new DataTransformation(
        DataType.Data,
        DataType.String.withFormat(DataFormat.Json),
      ),
    ),
    DataFormat.Json,
  ).withSource(source);
}

export function yamlToData(
  value: string | String | Text,
  source: DataSource | null = null,
): Data {
  source = source || (value as any).source || null;

  return map(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Yaml),
      DataType.Data,
    ),
  ).withSource(source);
}

export function dataToYaml(
  value: Data | any,
  source: DataSource | null = null,
): Text {
  if (!(value instanceof Data)) {
    value = new Data(value);
  }

  source = source || value.source;

  return wrapString(
    map(
      value,
      new DataTransformation(
        DataType.Data,
        DataType.String.withFormat(DataFormat.Yaml),
      ),
    ),
    DataFormat.Yaml,
  ).withSource(source);
}

export function csvToData(
  value: string | String,
  source: DataSource | null = null,
): Data {
  source = source || (value as any).source || null;

  return map(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Csv),
      DataType.Data,
    ),
  );
}

export function dataToCsv(
  value: Data | any,
  source: DataSource | null = null,
): Text {
  if (!(value instanceof Data)) {
    value = new Data(value);
  }

  source = source || value.source;

  return wrapString(
    map(
      value,
      new DataTransformation(
        DataType.Data,
        DataType.String.withFormat(DataFormat.Csv),
      ),
    ),
    DataFormat.Csv,
  ).withSource(source);
}

export function codeToAst(
  value: string | String,
  source: DataSource | null = null,
): Ast {
  source = source || (value as any).source || null;

  return map(
    unwrapString(value),
    new DataTransformation(DataType.String, DataType.Ast),
  );
}

export function astToCode(
  value: Ast | any,
  source: DataSource | null = null,
): Text {
  if (!(value instanceof Ast)) {
    value = new Ast(value);
  }

  source = source || value.source;

  return wrapString(
    map(value, new DataTransformation(DataType.Ast, DataType.String)),
    DataFormat.Csv,
  ).withSource(source);
}

export function wrapString(
  value: string | String,
  format: string | null = null,
  source: DataSource | null = null,
): Text {
  if (value instanceof Text) {
    let text = value;

    if (format) {
      text = text.withFormat(format);
    }

    if (source) {
      text = text.withSource(source);
    }

    return text;
  }

  return new Text(value, format, source);
}

export function unwrapString(value: string | String | Text): string {
  if (value instanceof Text) {
    value = value.value;
  }

  return value.toString();
}

export function wrapObject(value: any, source: DataSource | null = null): Data {
  return new Data(value, source);
}

export function unwrapObject(value: any | Data): any {
  if (value instanceof Data) {
    value = value.value;
  }

  return value;
}

export function wrapHtml(
  value: string | String,
  source: DataSource | null = null,
): Html {
  return map(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Html),
      DataType.Html,
    ),
  ).withSource(source);
}

export function unwrapHtml(value: Html): Text {
  return wrapString(value.value, DataFormat.Html, value.source);
}

export function wrapXml(
  value: string | String,
  source: DataSource | null = null,
): Xml {
  return map(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Xml),
      DataType.Xml,
    ),
  ).withSource(source);
}

export function unwrapXml(value: Xml): Text {
  return wrapString(value.value, DataFormat.Xml, value.source);
}
