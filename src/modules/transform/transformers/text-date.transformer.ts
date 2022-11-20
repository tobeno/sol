import { StringTransformer } from './string.transformer';
import { DataType } from '../../data/data-type';
import { DataFormat } from '../../data/data-format';

/**
 * Transformer for converting dates from and to strings.
 */
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
