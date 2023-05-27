import { DataType } from '../../../wrappers/data-type';
import { Url } from '../../../wrappers/url';
import { StringTransformer } from './string.transformer';

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
