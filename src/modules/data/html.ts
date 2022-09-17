import { Data } from './data';
import { Text } from './text';
import { DataFormat } from './data-format';

/**
 * Wrapper for HTML strings
 */
export class Html extends Data<string> {
  toString(): string {
    return String(this);
  }
}

export function wrapHtml(value: string | String | Text): Html {
  return new Html(String(value));
}

export function unwrapHtml<ContentType = any>(value: Html): Text<ContentType> {
  return new Text<ContentType>(value.value, DataFormat.Html);
}
