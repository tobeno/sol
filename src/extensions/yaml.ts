import { Yaml, yaml } from '../data/yaml';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';
import { awaitSync } from '../utils/async';

export function WithYaml<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get yaml() {
      if (this.data) {
        return yaml(this.data);
      }

      return yaml(this.text);
    }

    set yaml(value: Yaml) {
      if (this.data) {
        this.data = value.data;

        return;
      }

      this.text = value.text;
    }

    updateYaml(updater: (value: Yaml) => Yaml | Promise<Yaml>) {
      const updated = awaitSync(updater(this.yaml));
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.yaml = updated;
    }

    showYaml(formatter?: (value: Yaml) => any | Promise<any>) {
      let value = this.yaml;
      if (formatter) {
        value = awaitSync(formatter(value));
      }

      console.log(value);
    }
  };
}
