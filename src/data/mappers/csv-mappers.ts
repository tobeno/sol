import { StringMapper } from './string-mapper';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import Papa = require('papaparse');

export class CsvMapper extends StringMapper<any[]> {
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
