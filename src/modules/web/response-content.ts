import { Wrapper } from '../data/wrapper';
import { Text } from '../data/text';

export class ResponseContent extends Wrapper {
  get text(): Text {
    let text = this.value;
    if (this.value && typeof this.value === 'object') {
      text = JSON.stringify(this.value, null, 2);
    }

    return Text.create(String(text));
  }

  static create(value: any): ResponseContent {
    return new ResponseContent(value);
  }
}
