import { DataType } from '../../data/data-type';
import { StringTransformer } from './string.transformer';
import { Markdown } from '../../data/markdown';
import { DataTransformation } from '../data-transformation';
import { DataFormat } from '../../data/data-format';

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
