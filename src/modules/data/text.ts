import { DataFormat } from './data-format';
import { DataSource } from './data-source';
import { DataTransformation } from './data-transformation';
import { inspect } from 'util';

/**
 * Wrapper for strings
 */
export class Text<ContentType = any> extends String {
  constructor(
    value: string | String,
    public format: string | null = null,
    public source: DataSource | null = null,
    public sourceTransformation: DataTransformation | null = null,
  ) {
    super(value.toString());
  }

  get value(): string {
    return this.toString();
  }

  get rootSource(): DataSource | null {
    if (!this.source) {
      return null;
    }

    return this.source.rootSource || this.source;
  }

  get ext(): string {
    return DataFormat.toExt(this.format);
  }

  get text(): this {
    return this;
  }

  setFormat(format: string | null): this {
    this.format = format;

    return this;
  }

  setSource(source: DataSource | null): this {
    this.source = source;

    return this;
  }

  eval(): any {
    return eval(this.toString());
  }

  [inspect.custom]() {
    return this.toString();
  }
}
