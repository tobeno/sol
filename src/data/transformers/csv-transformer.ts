import { StringTransformer } from './string-transformer';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import * as Papa from 'papaparse';

export class CsvTransformer extends StringTransformer<any[]> {
  constructor() {
    super(DataType.Object, DataFormat.Csv);
  }

  stringify(input: any[]): string {
    return Papa.unparse(input, {
      header: true,
    });
  }

  parse(input: string): any[] {
    return Papa.parse<Record<string, any>>(input, {
      header: true,
    }).data;
  }
}
