import { DataTransformation } from './data-transformation';
import { DataType } from './data-type';
import { DataFormat } from './data-format';
import { DataSource } from './data-source';
import type { Ast } from './ast';
import type { Data } from './data';
import type { Html } from './html';
import type { Xml } from './xml';
import type { Text } from './text';
import type { Url } from './url';
import type { Constructor } from '../../interfaces/util';

// Hepler functions with dynamic imports to avoid circular dependencies
function getDataClass(): Constructor<Data> {
  return require('./data').Data;
}

function getAstClass(): Constructor<Ast> {
  return require('./ast').Ast;
}

function getTextClass(): Constructor<Text> {
  return require('./text').Text;
}

export function transform<InputType = any, OutputType = any>(
  input: InputType,
  transformation: DataTransformation | string,
): OutputType {
  if (typeof transformation === 'string') {
    transformation = DataTransformation.fromString(transformation);
  }

  // Import dynamically to avoid circular imports
  const { getRootTransformer } = require('./transformers/root-transformer');

  return getRootTransformer().transform(input, transformation);
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
  const Data = getDataClass();

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
  const Data = getDataClass();

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
  const Data = getDataClass();

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
  const Ast = getAstClass();
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
  const Text = getTextClass();
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

  return new Text(value, format, source);
}

export function unwrapString(value: string | String | Text): string {
  const Text = getTextClass();
  if (value instanceof Text) {
    value = value.value;
  }

  return value.toString();
}

export function wrapObject<ValueType = any>(
  value: ValueType,
  source: DataSource | null = null,
): Data<ValueType> {
  const Data = getDataClass();

  if (value instanceof Data) {
    let valueGeneric = value as any;

    if (source) {
      valueGeneric = valueGeneric.setSource(source);
    }

    return valueGeneric;
  }

  return new Data(value, source) as any;
}

export function unwrapObject<ValueType = any>(
  value: ValueType | Data<ValueType>,
): ValueType {
  const Data = getDataClass();

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

export function wrapUrl(
  value: string | String | Text,
  source: DataSource | null = null,
): Url {
  return transform(
    wrapString(value, null, source),
    new DataTransformation(DataType.Text, DataType.Url),
  );
}

export function unwrapUrl<ContentType = any>(value: Url): Text<ContentType> {
  return wrapString(value.value);
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
