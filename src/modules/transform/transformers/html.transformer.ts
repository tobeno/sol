import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { Html } from '../../../wrappers/html';
import { StringTransformer } from './string.transformer';

/**
 * Transformer for converting HTMLs from and to strings.
 */
export class HtmlTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Html, DataFormat.Html);
  }

  stringify(input: any): string {
    return String(input);
  }

  parse(input: string): any {
    return Html.create(input);
  }
}
