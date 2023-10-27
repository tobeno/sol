import type babelTypes from '@babel/types';
import type { MaybeWrapped } from '../../../interfaces/wrapper.interfaces';
import { Ast } from '../../../wrappers/ast.wrapper';
import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
import { Data } from '../../../wrappers/data.wrapper';
import { Markdown } from '../../../wrappers/markdown.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { DataTransformation } from '../data-transformation';
import { getRootTransformer } from '../transformers/root.transformer';

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
  if (value && typeof value === 'object' && !(value instanceof Text)) {
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
  if (value instanceof Ast) {
    return value;
  }

  if (value && typeof value === 'object' && 'type' in value) {
    return new Ast(value);
  }

  value = Text.create(value, null);

  return transform(value, new DataTransformation(DataType.Text, DataType.Ast));
}

export function astToCode(value: Ast | any): Text {
  value = Ast.create(value);

  return transform(value, new DataTransformation(DataType.Ast, DataType.Text));
}

export function markdownToHtml(value: Markdown | MaybeWrapped<string>): Text {
  value = Markdown.create(value);

  return transform(
    value,
    new DataTransformation(
      DataType.Markdown,
      DataType.Text.withFormat(DataFormat.Html),
    ),
  );
}
