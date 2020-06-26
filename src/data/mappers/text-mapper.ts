import { StringMapper } from './string-mapper';
import { DataType } from '../data-type';
import { Text } from '../text';

export class TextMapper extends StringMapper<Text> {
  constructor() {
    super(DataType.Text);
  }

  stringify(input: Text): string {
    return input.toString();
  }

  parse(input: string): Text {
    return new Text(input);
  }
}
