import { DataTransformer } from './data.transformer';
import { DataType } from '../../data/data-type';
import { AstTransformer } from './ast.transformer';
import { CsvTransformer } from './csv.transformer';
import { JsonTransformer } from './json.transformer';
import { YamlTransformer } from './yaml.transformer';
import { TextDateTransformer } from './text-date.transformer';
import { TextCommaSeparatedTransformer } from './text-comma-separated.transformer';
import { AnyTransformer } from './any.transformer';
import { UrlTransformer } from './url.transformer';
import { TextNewlineSeparatedTransformer } from './text-newline-separated.transformer';
import { TextSemicolonSeparatedTransformer } from './text-semicolon-separated.transformer';
import { Data } from '../../data/data';
import { Text } from '../../data/text';
import { WrappingTransformer } from './wrapping.transformer';
import { ToStringTransformer } from './tostring.transformer';

let rootTransformer: DataTransformer<any, any>;

export function getRootTransformer(): DataTransformer<any, any> {
  if (!rootTransformer) {
    const anyTransformer = new AnyTransformer([
      new AstTransformer(),
      new CsvTransformer(),
      new JsonTransformer(),
      new YamlTransformer(),
      new TextDateTransformer(),
      new TextCommaSeparatedTransformer(),
      new TextNewlineSeparatedTransformer(),
      new TextSemicolonSeparatedTransformer(),
      new ToStringTransformer(),
      new UrlTransformer(),
    ]);
    rootTransformer = new WrappingTransformer(
      Data,
      DataType.Object,
      new WrappingTransformer(Text, DataType.String, anyTransformer),
    );
  }

  return rootTransformer;
}
