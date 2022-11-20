import { StringTransformer } from './string.transformer';
import { DataType } from '../../data/data-type';
import { DataFormat } from '../../data/data-format';

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
