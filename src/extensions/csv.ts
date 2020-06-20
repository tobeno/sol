import { Csv, csv } from '../data/csv';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';
import { awaitSync } from '../utils/async';

export function WithCsv<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get csv() {
      return csv(this.text);
    }

    set csv(value: Csv) {
      this.text = value.text;
    }

    updateCsv(updater: (value: Csv) => Csv | Promise<Csv>) {
      const updated = awaitSync(updater(this.csv));
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.csv = updated;
    }

    showCsv(formatter?: (value: Csv) => any | Promise<any>) {
      let value = this.csv;
      if (formatter) {
        value = awaitSync(formatter(value));
      }

      console.log(value);
    }
  };
}
