import { DataType } from '../../data/data-type';
import { StringTransformer } from './string.transformer';
import { Url } from '../../data/url';

export class UrlTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Url);
  }

  stringify(input: any): string {
    if (input instanceof Url) {
      input = input.value;
    }

    return input;
  }

  parse(input: string): Url {
    return Url.create(input);
  }
}
