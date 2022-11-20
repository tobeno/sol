import { StringTransformer } from './string.transformer';
import { DataType } from '../../data/data-type';
import { DataFormat } from '../../data/data-format';
import { Xml } from '../../data/xml';

/**
 * Transformer for converting XMLs from and to strings.
 */
export class XmlTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Xml, DataFormat.Xml);
  }

  stringify(input: any): string {
    return String(input);
  }

  parse(input: string): any {
    return Xml.create(input);
  }
}
