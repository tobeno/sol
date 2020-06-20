import { Html, html } from '../data/html';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';
import { awaitSync } from '../utils/async';

export function WithHtml<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get html() {
      return html(this.text);
    }
    set html(value: Html) {
      this.text = value.text;
    }

    updateHtml(updater: (value: Html) => Html | Promise<Html>) {
      const updated = awaitSync(updater(this.html));
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.html = updated;
    }

    showHtml(formatter?: (data: Html) => any | Promise<any>) {
      let data = this.html;
      if (formatter) {
        data = awaitSync(formatter(data));
      }

      console.log(data);
    }
  };
}
