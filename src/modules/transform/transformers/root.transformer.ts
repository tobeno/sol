import { DataTransformer } from './data.transformer';
import { DataType } from '../../data/data-type';
import { AstTransformer } from './ast.transformer';
import { CsvTransformer } from './csv.transformer';
import { JsonTransformer } from './json.transformer';
import { YamlTransformer } from './yaml.transformer';
import { TextDateTransformer } from './text-date.transformer';
import { AnyTransformer } from './any.transformer';
import { UrlTransformer } from './url.transformer';
import { Data } from '../../data/data';
import { Text } from '../../data/text';
import { WrappingTransformer } from './wrapping.transformer';
import { ToStringTransformer } from './tostring.transformer';
import { Constructor } from '../../../interfaces/util';
import { Wrapper } from '../../data/wrapper';
import { JoinTransformer } from './join.transformer';
import { DataFormat } from '../../data/data-format';

let rootTransformer: DataTransformer<any, any>;

export function getRootTransformer(): DataTransformer<any, any> {
  if (!rootTransformer) {
    rootTransformer = new AnyTransformer([
      new AstTransformer(),
      new CsvTransformer(),
      new JsonTransformer(),
      new YamlTransformer(),
      new TextDateTransformer(),
      new JoinTransformer(',', DataFormat.TextCommaSeparated),
      new JoinTransformer('\n', DataFormat.TextNewlineSeparated),
      new JoinTransformer(';', DataFormat.TextSemicolonSeparated),
      new ToStringTransformer(),
      new UrlTransformer(),
    ]);

    for (const [dataClass, dataType] of [
      [Data, DataType.Object],
      [Text, DataType.String],
    ] as [Constructor<Wrapper>, DataType][]) {
      rootTransformer = new WrappingTransformer(
        dataClass,
        dataType,
        rootTransformer,
      );
    }
  }

  return rootTransformer;
}
