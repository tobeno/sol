import { StringMapper } from './string-mapper';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import * as YAML from 'yaml';

export class YamlMapper extends StringMapper<any> {
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
