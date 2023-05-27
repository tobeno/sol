import { MaybeWrapped } from '../interfaces/data.interfaces';
import { DataFormat } from './data-format.wrapper';
import { Text } from './text.wrapper';
import { Wrapper } from './wrapper.wrapper';

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
