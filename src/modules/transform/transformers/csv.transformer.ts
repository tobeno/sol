import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { StringTransformer } from './string.transformer';

/**
 * Transformer for converting CSVs from and to strings.
 */
export class CsvTransformer extends StringTransformer<any[]> {
  constructor() {
    super(DataType.Object, DataFormat.Csv);
  }

  stringify(input: any[]): string {
    return require('papaparse').unparse(input, {
      header: true,
    });
  }

  parse(input: string): any[] {
    return require('papaparse').parse(input, {
      header: true,
    }).data;
  }
}
