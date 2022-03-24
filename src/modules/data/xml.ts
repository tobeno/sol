import { Data } from './data';
import { Text, wrapString } from './text';
import { DataSource } from './data-source';
import { DataFormat } from './data-format';
import { DataTransformation } from './data-transformation';
import { DataType } from './data-type';
import { transform } from './transformer';

/**
 * Wrapper for XML strings
 */
export class Xml extends Data<string> {
  toString(): string {
    return String(this);
  }
}

export function wrapXml(
  value: string | String | Text,
  source: DataSource | null = null,
): Xml {
  return transform(
    wrapString(value, DataFormat.Xml, source),
    new DataTransformation(
      DataType.String.withFormat(DataFormat.Xml),
      DataType.Xml,
    ),
  );
}

export function unwrapXml(value: Xml): Text {
  return wrapString(value.value, DataFormat.Xml, value.source);
}
