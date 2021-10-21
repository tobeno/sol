import { StringTransformer } from './string-transformer';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import { Xml } from '../xml';

export class XmlTransformer extends StringTransformer<Xml> {
  constructor() {
    super(DataType.Xml, DataFormat.Xml);
  }

  stringify(input: Xml): string {
    return input.value;
  }

  parse(input: string): Xml {
    return new Xml(input);
  }
}
