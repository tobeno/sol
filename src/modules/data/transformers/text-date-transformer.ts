import { StringTransformer } from './string-transformer';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';

export class TextDateTransformer extends StringTransformer<Date> {
  constructor() {
    super(DataType.Date, DataFormat.TextDate);
  }

  stringify(input: Date): string {
    return input.toISOString();
  }

  parse(input: string): Date {
    return new Date(input);
  }
}
