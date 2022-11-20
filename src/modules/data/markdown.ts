import { Wrapper } from './wrapper';
import { Text } from './text';
import { DataFormat } from './data-format';

/**
 * Wrapper for Markdown documents.
 */
export class Markdown extends Wrapper<string> {
  /**
   * Returns the text of the Markdown document.
   */
  get text(): Text {
    return Text.create(this.value, DataFormat.Markdown);
  }

  static create(value: Text | string | any): Markdown {
    if (value instanceof Markdown) {
      return value;
    }

    return new Markdown(String(value));
  }
}
