import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';

export function WithText<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    async updateText(
      updater: (value: string) => string | Promise<string>,
    ): Promise<void> {
      const updated = await updater(this.text);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.text = updated;
    }

    async showText(
      formatter?: (text: string) => any | Promise<any>,
    ): Promise<void> {
      let text = this.text;
      if (formatter) {
        text = await formatter(text);
      }

      console.log(text);
    }

    toString() {
      return this.text;
    }
  };
}
