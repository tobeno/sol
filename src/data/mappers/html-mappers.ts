import { StringMapper } from './string-mapper';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import { Html } from '../html';

export class HtmlMapper extends StringMapper<Html> {
  constructor() {
    super(DataType.Html, DataFormat.Html);
  }

  stringify(input: Html): string {
    return input.value;
  }

  parse(input: string): Html {
    return new Html(input);
  }
}
