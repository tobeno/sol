import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { Xml } from '../../../wrappers/xml';
import { StringTransformer } from './string.transformer';

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
