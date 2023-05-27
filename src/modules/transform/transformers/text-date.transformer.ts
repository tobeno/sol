import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { StringTransformer } from './string.transformer';

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
