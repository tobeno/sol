import { ClassWithText } from '../interfaces/base';
import { Constructor } from '../interfaces/util';

export function WithData<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get data(): any {

      if(super.data) {
        return super.data;
      }

      return JSON.parse(this.text);
    }

    set data(value: any) {
      if(super.data) {
        super.data = value;

        return;
      }

      this.text = JSON.stringify(value, null, 2);
    }

    async updateData(
      updater: (value: any) => any | Promise<any>,
    ): Promise<void> {
      const updated = await updater(this.data);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.data = updated;
    }

    async showData(
      formatter?: (value: any) => any | Promise<any>,
    ): Promise<void> {
      let value = this.data;
      if (formatter) {
        value = await formatter(value);
      }

      console.log(value);
    }
  };
}
