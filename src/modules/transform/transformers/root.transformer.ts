import { Constructor } from '../../../interfaces/util';
import { Data } from '../../../wrappers/data';
import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { Text } from '../../../wrappers/text';
import { Wrapper } from '../../../wrappers/wrapper';
import { AnyTransformer } from './any.transformer';
import { AstTransformer } from './ast.transformer';
import { CsvTransformer } from './csv.transformer';
import { DataTransformer } from './data.transformer';
import { GraphTransformer } from './graph.transformer';
import { HtmlTransformer } from './html.transformer';
import { JoinTransformer } from './join.transformer';
import { JsonTransformer } from './json.transformer';
import { MarkdownTransformer } from './markdown.transformer';
import { TextDateTransformer } from './text-date.transformer';
import { ToStringTransformer } from './tostring.transformer';
import { UrlTransformer } from './url.transformer';
import { WrappingTransformer } from './wrapping.transformer';
import { XmlTransformer } from './xml.transformer';
import { YamlTransformer } from './yaml.transformer';

let rootTransformer: DataTransformer<any, any>;

/**
 * Returns the root transformer of the transformation stack.
 */
export function getRootTransformer(): DataTransformer<any, any> {
  if (!rootTransformer) {
    rootTransformer = new AnyTransformer([
      new AstTransformer(),
      new CsvTransformer(),
      new JsonTransformer(),
      new YamlTransformer(),
      new HtmlTransformer(),
      new XmlTransformer(),
      new MarkdownTransformer(),
      new GraphTransformer(),
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
