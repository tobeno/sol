import { csv } from '../data/fn';
import { Csv } from '../data/csv';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';

export function WithCsv<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get csv() {
      return csv(this.text);
    }

    set csv(value: Csv) {
      this.text = value.text;
    }

    async updateCsv(
      updater: (value: Csv) => Csv | Promise<Csv>,
    ): Promise<void> {
      const updated = await updater(this.csv);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.csv = updated;
    }

    async showCsv(
      formatter?: (value: Csv) => any | Promise<any>,
    ): Promise<void> {
      let value = this.csv;
      if (formatter) {
        value = await formatter(value);
      }

      console.log(value);
    }
  };
}
