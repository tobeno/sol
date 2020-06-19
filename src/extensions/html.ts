import { Html,html } from '../data/html';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';

export function WithHtml<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get html() {
      return html(this.text);
    }
    set html(value: Html) {
      this.text = value.text;
    }

    async updateHtml(
      updater: (value: Html) => Html | Promise<Html>,
    ): Promise<void> {
      const updated = await updater(this.html);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.html = updated;
    }

    async showHtml(
      formatter?: (data: Html) => any | Promise<any>,
    ): Promise<void> {
      let data = this.html;
      if (formatter) {
        data = await formatter(data);
      }

      console.log(data);
    }
  };
}
