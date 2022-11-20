import { DataTransformation } from './data-transformation';
import { DataType } from '../data/data-type';
import { DataFormat } from '../data/data-format';
import type { Ast } from '../data/ast';
import type { Data } from '../data/data';
import type { Text } from '../data/text';
import type { Markdown } from '../data/markdown';
import type { DataTransformer } from './transformers/data.transformer';

// Helper functions with dynamic imports to avoid circular dependencies
function getDataClass(): typeof Data {
  return require('../data/data').Data;
}

function getAstClass(): typeof Ast {
  return require('../data/ast').Ast;
}

function getTextClass(): typeof Text {
  return require('../data/text').Text;
}

function getMarkdownClass(): typeof Markdown {
  return require('../data/markdown').Markdown;
}

function getRootTransformer(): DataTransformer<any, any> {
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
  value: Text | string | any,
): Data<ValueType> {
  const Text = getTextClass();
  if (value && typeof value === 'object' && !(value instanceof Text)) {
    const Data = getDataClass();

    return Data.create(value) as any;
  }

  value = Text.create(value, DataFormat.Json);

  return transform(
    value,
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Json),
      DataType.Data,
    ),
  );
}

export function dataToJson(value: Data | any): Text {
  const Data = getDataClass();
  value = Data.create(value);

  return transform(
    value,
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Json),
    ),
  );
}

export function yamlToData<ValueType = any>(
  value: Text | string,
): Data<ValueType> {
  const Text = getTextClass();
  value = Text.create(value, DataFormat.Yaml);

  return transform(
    value,
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Yaml),
      DataType.Data,
    ),
  );
}

export function dataToYaml(value: Data | any): Text {
  const Data = getDataClass();
  value = Data.create(value);

  return transform(
    value,
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Yaml),
    ),
  );
}

export function csvToData<ValueType = any>(
  value: Text | string,
): Data<ValueType> {
  const Text = getTextClass();
  value = Text.create(value, DataFormat.Csv);

  return transform(
    value,
    new DataTransformation(
      DataType.Text.withFormat(DataFormat.Csv),
      DataType.Data,
    ),
  );
}

export function dataToCsv(value: Data | any): Text {
  const Data = getDataClass();
  value = Data.create(value);

  return transform(
    value,
    new DataTransformation(
      DataType.Data,
      DataType.Text.withFormat(DataFormat.Csv),
    ),
  );
}

export function codeToAst(value: Text | string): Ast {
  const Text = getTextClass();
  value = Text.create(value, null);

  return transform(value, new DataTransformation(DataType.Text, DataType.Ast));
}

export function astToCode(value: Ast | any): Text {
  const Ast = getAstClass();
  value = Ast.create(value);

  return transform(value, new DataTransformation(DataType.Ast, DataType.Text));
}

export function markdownToHtml(value: Markdown | Text | string): Text {
  const Markdown = getMarkdownClass();
  value = Markdown.create(value);

  return transform(
    value,
    new DataTransformation(
      DataType.Markdown,
      DataType.Text.withFormat(DataFormat.Html),
    ),
  );
}
