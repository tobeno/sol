import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { Markdown } from '../../../wrappers/markdown';
import { DataTransformation } from '../data-transformation';
import { StringTransformer } from './string.transformer';

/**
 * Transformer for converting Markdowns from and to strings.
 */
export class MarkdownTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Markdown, DataFormat.Html);
  }

  stringify(input: any): string {
    if (input instanceof Markdown) {
      const { marked } = require('marked') as typeof import('marked');

      input = marked.parse(input.value);
    }

    return input;
  }

  parse(input: string, transformation: DataTransformation): Markdown {
    throw new Error('Cannot convert HTML back to Markdown.');
  }
}
