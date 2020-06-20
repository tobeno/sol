import { Json, json } from '../data/json';
import { Constructor } from '../interfaces/util';
import { ClassWithData } from '../interfaces/base';
import { awaitSync } from '../utils/async';

export function WithJson<T extends Constructor<ClassWithData>>(base: T) {
  return class Wrapped extends base {
    get json() {
      return json(this.data);
    }
    set json(value: Json) {
      this.data = value.data;
    }

    updateJson(updater: (value: Json) => Json | Promise<Json>) {
      const updated = awaitSync(updater(this.data));
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.data = updated;
    }

    showJson(formatter?: (data: any) => any | Promise<any>) {
      let data = this.data;
      if (formatter) {
        data = awaitSync(formatter(data));
      }

      console.log(data);
    }
  };
}
