import { StringTransformer } from './string-transformer';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';

export class JsonTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Object, DataFormat.Json);
  }

  stringify(input: any): string {
    return JSON.stringify(input, null, 2);
  }

  parse(input: string): any {
    return JSON.parse(input);
  }
}
