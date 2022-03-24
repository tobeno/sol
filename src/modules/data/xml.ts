import { JSDOM } from 'jsdom';
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
  root: DocumentFragment;

  constructor(value: string) {
    super(value);
    this.root = JSDOM.fragment(value);
  }

  get innerText(): string {
    return this.root.textContent || '';
  }

  query(selector: string): Xml | null {
    const node = this.root.querySelector(selector);

    return node ? new Xml(node.outerHTML) : null;
  }

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
