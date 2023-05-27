import type babelTypes from '@babel/types';
import { MaybeWrapped } from '../../../interfaces/data';
import type { Ast } from '../../../wrappers/ast';
import type { Data } from '../../../wrappers/data';
import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import type { Markdown } from '../../../wrappers/markdown';
import type { Text } from '../../../wrappers/text';
import { DataTransformation } from '../data-transformation';
import type { DataTransformer } from '../transformers/data.transformer';

// Helper functions with dynamic imports to avoid circular dependencies
function getDataClass(): typeof Data {
  return require('../../../wrappers/data').Data;
}

function getAstClass(): typeof Ast {
  return require('../../../wrappers/ast').Ast;
}

function getTextClass(): typeof Text {
  return require('../../../wrappers/text').Text;
}

function getMarkdownClass(): typeof Markdown {
  return require('../../../wrappers/markdown').Markdown;
}

function getRootTransformer(): DataTransformer<any, any> {
  // Import dynamically to avoid circular imports
  const { getRootTransformer } = require('../transformers/root.transformer');

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
  value: MaybeWrapped<string> | any,
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
  value: MaybeWrapped<string>,
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
  value: MaybeWrapped<string>,
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

export function codeToAst(
  value: MaybeWrapped<string> | Ast | babelTypes.Node,
): Ast {
  const Ast = getAstClass();
  if (value instanceof Ast) {
    return value;
  }

  if (value && typeof value === 'object' && 'type' in value) {
    return new Ast(value);
  }

  const Text = getTextClass();
  value = Text.create(value, null);

  return transform(value, new DataTransformation(DataType.Text, DataType.Ast));
}

export function astToCode(value: Ast | any): Text {
  const Ast = getAstClass();
  value = Ast.create(value);

  return transform(value, new DataTransformation(DataType.Ast, DataType.Text));
}

export function markdownToHtml(value: Markdown | MaybeWrapped<string>): Text {
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
