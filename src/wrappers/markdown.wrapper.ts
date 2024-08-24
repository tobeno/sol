import type { MaybeWrapped } from '../interfaces/wrapper.interfaces';
import { DataFormat } from './data-format.wrapper';
import { Text } from './text.wrapper';
import { Wrapper } from './wrapper.wrapper';

/**
 * Wrapper for Markdown documents.
 */
export class Markdown extends Wrapper<string> {
  static readonly usageHelp = `
> markdown('# Title').text
> markdown('# Title').html.browse()
  `.trim();

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

    const result = new Markdown(String(value));

    return withHelp(
      result,
      `
Markdown wrapper around a Markdown document.

Usage:
${Markdown.usageHelp}
    `,
    );
  }
}
