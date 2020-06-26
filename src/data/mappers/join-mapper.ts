import { StringMapper } from './string-mapper';
import { DataType } from '../data-type';

export class JoinMapper extends StringMapper<any[]> {
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
