import { StringTransformer } from './string.transformer';
import { DataType } from '../../data/data-type';
import { DataFormat } from '../../data/data-format';
import stripJsonComments from 'strip-json-comments';

/**
 * Transformer for converting JSONs from and to strings.
 */
export class JsonTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Object, DataFormat.Json);
  }

  stringify(input: any): string {
    return JSON.stringify(input, null, 2);
  }

  parse(input: string): any {
    return JSON.parse(stripJsonComments(input));
  }
}
