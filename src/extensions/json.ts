import { Json, json } from '../data/json';
import { Constructor } from '../interfaces/util';
import { ClassWithData } from '../interfaces/base';

export function WithJson<T extends Constructor<ClassWithData>>(base: T) {
  return class Wrapped extends base {
    get json() {
      return json(this.data);
    }
    set json(value: Json) {
      this.data = value.data;
    }

    async updateJson(
      updater: (value: Json) => Json | Promise<Json>,
    ): Promise<void> {
      const updated = await updater(this.data);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.data = updated;
    }

    async showJson(
      formatter?: (data: any) => any | Promise<any>,
    ): Promise<void> {
      let data = this.data;
      if (formatter) {
        data = await formatter(data);
      }

      console.log(data);
    }
  };
}
