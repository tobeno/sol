import stripJsonComments from 'strip-json-comments';
import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { StringTransformer } from './string.transformer';

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
