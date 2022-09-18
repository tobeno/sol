import { DataTransformation } from './data-transformation';
import { DataType } from '../data/data-type';
import { DataFormat } from '../data/data-format';
import type { Ast } from '../data/ast';
import type { Data } from '../data/data';
import type { Text } from '../data/text';

// Hepler functions with dynamic imports to avoid circular dependencies
function getDataClass() {
  return require('../data/data').Data;
}

function getAstClass() {
  return require('../data/ast').Ast;
}

function getTextClass() {
  return require('../data/text').Text;
}

function getRootTransformer() {
  // Import dynamically to avoid circular imports
  const { getRootTransformer } = require('./transformers/root.transformer');

  return getRootTransformer();
}

export function transform<InputType = any, OutputType = any>(
  input: InputType,
  transformation: DataTransformation | string,
): OutputType {
  if (typeof transformation === 'string') {
    transformation = DataTransformation.fromString(transformation);
  }

  return getRootTransformer().transform(input, transformation);
}

export function jsonToData<ValueType = any>(
  value: string | Text,
): Data<ValueType> {
  const Text = getTextClass();

  return transform(
    Text.create(value, DataFormat.Json),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Json),
      DataType.Data,
    ),
  );
}

export function dataToJson<ValueType = any>(
  value: Data<ValueType> | ValueType,
): Text<ValueType> {
  const Data = getDataClass();

  if (!(value instanceof Data)) {
    value = new Data(value) as Data<ValueType>;
  }

  return transform(
    Data.create(value),
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Json),
    ),
  );
}

export function yamlToData<ValueType = any>(
  value: string | String | Text,
): Data<ValueType> {
  const Text = getTextClass();

  return transform(
    Text.create(value, DataFormat.Yaml),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Yaml),
      DataType.Data,
    ),
  );
}

export function dataToYaml<ValueType = any>(
  value: Data<ValueType> | ValueType,
): Text<ValueType> {
  const Data = getDataClass();

  if (!(value instanceof Data)) {
    value = new Data(value) as Data<ValueType>;
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
): Data<ValueType> {
  const Text = getTextClass();

  return transform(
    Text.create(value, DataFormat.Csv),
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Csv),
      DataType.Data,
    ),
  );
}

export function dataToCsv<ValueType = any>(
  value: Data<ValueType> | ValueType,
): Text<ValueType> {
  const Data = getDataClass();

  if (!(value instanceof Data)) {
    value = new Data(value) as Data<ValueType>;
  }

  return transform(
    value,
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Csv),
    ),
  );
}

export function codeToAst(value: string | String | Text): Ast {
  const Text = getTextClass();

  return transform(
    Text.create(value, null),
    new DataTransformation(DataType.Text, DataType.Ast),
  );
}

export function astToCode(value: Ast | any): Text {
  const Ast = getAstClass();
  if (!(value instanceof Ast)) {
    value = new Ast(value);
  }

  return transform(value, new DataTransformation(DataType.Ast, DataType.Text));
}
