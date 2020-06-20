import { jsonata, Expression } from '../integrations/jsonata';
import { inspect } from 'util';
import { WithAllText } from '../wrappers/with-all-text';
import { csv } from './csv';
import { yaml } from './yaml';

export class UnwrappedJson {
  constructor(public data: any) {}

  get text() {
    return JSON.stringify(this.data, null, 2);
  }

  set text(value: string) {
    this.data = JSON.parse(value);
  }

  get csv() {
    return csv(this.data);
  }

  get yaml() {
    return yaml(this.data);
  }

  get keys() {
    if (Array.isArray(this.data)) {
      return this.data.map((_, index) => index);
    }

    return Object.keys(this.data);
  }

  get values() {
    if (Array.isArray(this.data)) {
      return this.data;
    }

    return Object.values(this.data);
  }

  transform(exp: string | Expression): Json {
    if (typeof exp === 'string') {
      exp = jsonata(exp);
    }

    return new Json(exp.evaluate(this.data));
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.data;
  }

  toString() {
    return this.text;
  }
}

export class Json extends WithAllText(UnwrappedJson) {}

export function json(...args: ConstructorParameters<typeof Json>) {
  return new Json(...args);
}
