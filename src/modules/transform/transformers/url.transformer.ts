import { DataType } from '../../data/data-type';
import { StringTransformer } from './string.transformer';
import { Url } from '../../web/url';

/**
 * Transformer for converting URLs from and to strings.
 */
export class UrlTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Url);
  }

  stringify(input: any): string {
    return String(input);
  }

  parse(input: string): Url {
    return Url.create(input);
  }
}
