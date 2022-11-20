import { StringTransformer } from './string.transformer';
import { DataType } from '../../data/data-type';
import { DataFormat } from '../../data/data-format';
import { Html } from '../../data/html';

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
