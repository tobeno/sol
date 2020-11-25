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
import { SetSourceTransformer } from './transformers/set-source-transformer';
import { DataSource } from './data-source';
import { SetSourceTransformationTransformer } from './transformers/set-source-transformation-transformer';
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
    transformer = new SetSourceTransformationTransformer(
      new SetSourceTransformer(
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
  value: string | Text,
  source: DataSource | null = null,
): Data<ValueType> {
  source = source || (value as any).source || null;

  return transform(
    wrapString(value, DataFormat.Json, source),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Json),
      DataType.Data,
    ),
  );
}

export function dataToJson<ValueType = any>(
  value: Data<ValueType> | any,
  source: DataSource | null = null,
): Text<ValueType> {
  if (!(value instanceof Data)) {
    value = new Data<ValueType>(value);
  }

  source = source || value.source;

  return transform(
    wrapString(value, DataFormat.Json, source),
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Json),
    ),
  );
}

export function yamlToData<ValueType = any>(
  value: string | String | Text,
  source: DataSource | null = null,
): Data<ValueType> {
  return transform(
    wrapString(value, DataFormat.Yaml, source),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Yaml),
      DataType.Data,
    ),
  );
}

export function dataToYaml<ValueType = any>(
  value: Data<ValueType> | any,
  source: DataSource | null = null,
): Text<ValueType> {
  if (!(value instanceof Data)) {
    value = new Data(value);
  }

  if (source) {
    value.setSource(source);
  }

  return transform(
    value,
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Yaml),
    ),
  );
}

export function csvToData<ValueType = any>(
  value: string | String | Text,
  source: DataSource | null = null,
): Data<ValueType> {
  return transform(
    wrapString(value, DataFormat.Csv, source),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Csv),
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

  if (source) {
    value.setSource(source);
  }

  return transform(
    value,
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Csv),
    ),
  );
}

export function codeToAst(
  value: string | String | Text,
  source: DataSource | null = null,
): Ast {
  return transform(
    wrapString(value, null, source),
    new DataTransformation(DataType.Text, DataType.Ast),
  );
}

export function astToCode(
  value: Ast | any,
  source: DataSource | null = null,
): Text {
  if (!(value instanceof Ast)) {
    value = new Ast(value);
  }

  if (source) {
    value = value.withSource(source);
  }

  return transform(value, new DataTransformation(DataType.Ast, DataType.Text));
}

export function wrapString<ContentType = any>(
  value: string | String | Text,
  format: string | null = null,
  source: DataSource | null = null,
): Text<ContentType> {
  if (value instanceof Text) {
    let text = value;

    if (format) {
      text = text.setFormat(format);
    }

    if (source) {
      text = text.setSource(source);
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
    wrapString(value, DataFormat.Html, source),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Html),
      DataType.Html,
    ),
  );
}

export function unwrapHtml<ContentType = any>(value: Html): Text<ContentType> {
  return wrapString(value.value, DataFormat.Html, value.source);
}

export function wrapXml(
  value: string | String | Text,
  source: DataSource | null = null,
): Xml {
  return transform(
    wrapString(value, DataFormat.Xml, source),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Xml),
      DataType.Xml,
    ),
  );
}

export function unwrapXml(value: Xml): Text {
  return wrapString(value.value, DataFormat.Xml, value.source);
}
