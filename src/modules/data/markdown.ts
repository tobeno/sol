import { Wrapper } from './wrapper';
import { Text } from './text';
import { DataFormat } from './data-format';

export class Markdown extends Wrapper<string> {
  get text(): Text {
    return Text.create(this.value, DataFormat.Markdown);
  }

  static create(value: Text | String | string | any): Markdown {
    if (value instanceof Markdown) {
      return value;
    }

    return new Markdown(String(value));
  }
}
