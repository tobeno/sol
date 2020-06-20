import { inspect } from 'util';
import * as YAML from 'yaml';
import { WithAllText } from '../wrappers/with-all-text';
import { json } from './json';

export class UnwrappedYaml {
  data: any[];

  constructor(data: string | any) {
    if (typeof data === 'string') {
      data = UnwrappedYaml.parse(data);
    }

    this.data = data;
  }

  set text(value: string) {
    this.data = UnwrappedYaml.parse(value);
  }

  get text(): string {
    return this.toString();
  }

  get json() {
    return json(this.data);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.toString();
  }

  toString() {
    return UnwrappedYaml.stringify(this.data);
  }

  static parse(data: string, options?: YAML.Options): any {
    return YAML.parse(data, options);
  }

  static stringify(data: any, options?: YAML.Options): string {
    return YAML.stringify(data, options);
  }
}

export class Yaml extends WithAllText(UnwrappedYaml) {}

export function yaml(data: string | any) {
  return new Yaml(data);
}
