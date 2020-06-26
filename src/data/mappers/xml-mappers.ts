import { StringMapper } from './string-mapper';
import { DataType } from '../data-type';
import { DataFormat } from '../data-format';
import { Xml } from '../xml';

export class XmlMapper extends StringMapper<Xml> {
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
