import { AnyTransformer } from './transformers/any-transformer';
import { DataTransformation } from './data-transformation';
import { WrappingTransformer } from './transformers/wrapping-transformer';
import { Data } from './data';
import { DataType } from './data-type';
import { DataFormat } from './data-format';
import { CsvTransformer } from './transformers/csv-transformer';
import { JsonTransformer } from './transformers/json-transformer';
import { YamlTransformer } from './transformers/yaml-transformer';
import { HtmlTransformer } from './transformers/html-transformer';
import { XmlTransformer } from './transformers/xml-transformer';
import { TextCommaSeparatedTransformer } from './transformers/text-comma-separated-transformer';
import { TextNewlineSeparatedTransformer } from './transformers/text-newline-separated-transformer';
import { TextSemicolonSeparatedTransformer } from './transformers/text-semicolon-separated-transformer';
import { ToStringTransformer } from './transformers/tostring-transformer';
import { Html } from './html';
import { Xml } from './xml';
import { Text } from './text';
import { DataSourceTransformer } from './transformers/data-source-transformer';
import { DataSource } from './data-source';
import { DataTransformationTransformer } from './transformers/data-transformation-transformer';
import { Ast } from './ast';
import { AstTransformer } from './transformers/ast-transformer';
import { DataTransformer } from './transformers/data-transformer';
import { TextDateTransformer } from './transformers/text-date-transformer';

let transformer: DataTransformer<any, any> | null = null;

function getTransformer(): DataTransformer<any, any> {
  if (!transformer) {
    const anyTransformer = new AnyTransformer([
      new AstTransformer(),
      new CsvTransformer(),
      new JsonTransformer(),
      new YamlTransformer(),
      new HtmlTransformer(),
      new XmlTransformer(),
      new TextDateTransformer(),
      new TextCommaSeparatedTransformer(),
      new TextNewlineSeparatedTransformer(),
      new TextSemicolonSeparatedTransformer(),
      new ToStringTransformer(),
    ]);
    transformer = new DataTransformationTransformer(
      new DataSourceTransformer(
        new WrappingTransformer(
          Data,
          DataType.Object,
          new WrappingTransformer(Text, DataType.String, anyTransformer),
        ),
      ),
    );
  }

  return transformer;
}

export function transform<InputType = any, OutputType = any>(
  input: InputType,
  transformation: DataTransformation | string,
): OutputType {
  if (typeof transformation === 'string') {
    transformation = DataTransformation.fromString(transformation);
  }

  return getTransformer().transform(input, transformation);
}

export function jsonToData<ValueType = any>(
  value: string | String,
  source: DataSource | null = null,
): Data<ValueType> {
  source = source || (value as any).source || null;

  return transform(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Json),
      DataType.Data,
    ),
  ).withSource(source);
}

export function dataToJson<ValueType = any>(
  value: Data<ValueType> | any,
  source: DataSource | null = null,
): Text<ValueType> {
  if (!(value instanceof Data)) {
    value = new Data<ValueType>(value);
  }

  source = source || value.source;

  return wrapString<ValueType>(
    transform(
      value,
      new DataTransformation(
        DataType.Data,
        DataType.String.withFormat(DataFormat.Json),
      ),
    ),
    DataFormat.Json,
  ).withSource(source);
}

export function yamlToData<ValueType = any>(
  value: string | String | Text,
  source: DataSource | null = null,
): Data<ValueType> {
  source = source || (value as any).source || null;

  return transform(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Yaml),
      DataType.Data,
    ),
  ).withSource(source);
}

export function dataToYaml<ValueType = any>(
  value: Data<ValueType> | any,
  source: DataSource | null = null,
): Text<ValueType> {
  if (!(value instanceof Data)) {
    value = new Data(value);
  }

  source = source || value.source;

  return wrapString<ValueType>(
    transform(
      value,
      new DataTransformation(
        DataType.Data,
        DataType.String.withFormat(DataFormat.Yaml),
      ),
    ),
    DataFormat.Yaml,
  ).withSource(source);
}

export function csvToData<ValueType = any>(
  value: string | String,
  source: DataSource | null = null,
): Data<ValueType> {
  source = source || (value as any).source || null;

  return transform(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Csv),
      DataType.Data,
    ),
  );
}

export function dataToCsv<ValueType = any>(
  value: Data<ValueType> | any,
  source: DataSource | null = null,
): Text<ValueType> {
  if (!(value instanceof Data)) {
    value = new Data(value);
  }

  source = source || value.source;

  return wrapString<ValueType>(
    transform(
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

  return transform(
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
    transform(value, new DataTransformation(DataType.Ast, DataType.String)),
  ).withSource(source);
}

export function wrapString<ContentType = any>(
  value: string | String,
  format: string | null = null,
  source: DataSource | null = null,
): Text<ContentType> {
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

  return new Text<ContentType>(value, format, source);
}

export function unwrapString(value: string | String | Text): string {
  if (value instanceof Text) {
    value = value.value;
  }

  return value.toString();
}

export function wrapObject<ValueType = any>(
  value: ValueType,
  source: DataSource | null = null,
): Data<ValueType> {
  return new Data<ValueType>(value, source);
}

export function unwrapObject<ValueType = any>(
  value: ValueType | Data<ValueType>,
): ValueType {
  if (value instanceof Data) {
    value = value.value;
  }

  return value;
}

export function wrapHtml(
  value: string | String | Text,
  source: DataSource | null = null,
): Html {
  return transform(
    unwrapString(value),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Html),
      DataType.Html,
    ),
  ).withSource(source);
}

export function unwrapHtml<ContentType = any>(value: Html): Text<ContentType> {
  return wrapString(value.value, DataFormat.Html, value.source);
}

export function wrapXml(
  value: string | String | Text,
  source: DataSource | null = null,
): Xml {
  return transform(
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
