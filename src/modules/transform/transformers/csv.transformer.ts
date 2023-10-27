import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
import { StringTransformer } from './string.transformer';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

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
