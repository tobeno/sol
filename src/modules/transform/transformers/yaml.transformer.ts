import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
import { StringTransformer } from './string.transformer';

/**
 * Transformer for converting YAMLs from and to strings.
 */
export class YamlTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Object, DataFormat.Yaml);
  }

  stringify(input: any): string {
    return require('yaml').stringify(input);
  }

  parse(input: string): any {
    return require('yaml').parse(input);
  }
}
