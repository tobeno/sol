import { MaybeWrapped } from '../interfaces/data';
import { DataFormat } from './data-format';
import { Text } from './text';
import { Wrapper } from './wrapper';

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

  static create(value: MaybeWrapped<string> | any): Markdown {
    if (value instanceof Markdown) {
      return value;
    }

    return new Markdown(String(value));
  }
}
