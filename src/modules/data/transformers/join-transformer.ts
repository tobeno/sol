import { StringTransformer } from './string-transformer';
import { DataType } from '../data-type';

export class JoinTransformer extends StringTransformer<any[]> {
  constructor(readonly separator: string, baseFormat: string) {
    super(DataType.Object, baseFormat);
  }

  stringify(input: any[]): string {
    return Array.from(input).join(this.separator);
  }

  parse(input: string): any {
    return input.split(this.separator);
  }
}
