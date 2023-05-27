import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
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
