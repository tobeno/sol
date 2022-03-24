import { Data } from './data';
import { Text } from './text';
import { DataSource } from './data-source';
import { DataFormat } from './data-format';

/**
 * Wrapper for HTML strings
 */
export class Html extends Data<string> {
  toString(): string {
    return String(this);
  }
}

export function wrapHtml(
  value: string | String | Text,
  source: DataSource | null = null,
): Html {
  const html = new Html(String(value));

  if (source) {
    html.setSource(source);
  }

  return html;
}

export function unwrapHtml<ContentType = any>(value: Html): Text<ContentType> {
  return new Text<ContentType>(value.value, DataFormat.Html, value.source);
}
