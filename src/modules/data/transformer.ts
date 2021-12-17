import { DataTransformation } from './data-transformation';
import { DataType } from './data-type';
import { DataFormat } from './data-format';
import { DataSource } from './data-source';
import type { Ast } from './ast';
import type { Data } from './data';
import type { Text } from './text';
import { wrapString } from './text';
import type { Constructor } from '../../interfaces/util';

// Hepler functions with dynamic imports to avoid circular dependencies
function getDataClass(): Constructor<Data> {
  return require('./data').Data;
}

function getAstClass(): Constructor<Ast> {
  return require('./ast').Ast;
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
