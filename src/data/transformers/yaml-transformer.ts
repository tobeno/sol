import { StringTransformer } from './string-transformer';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import * as YAML from 'yaml';

export class YamlTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Object, DataFormat.Yaml);
  }

  stringify(input: any): string {
    return YAML.stringify(input);
  }

  parse(input: string): any {
    return YAML.parse(input);
  }
}
