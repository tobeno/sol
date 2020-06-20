import { Xml, xml } from '../data/xml';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';
import { awaitSync } from '../utils/async';

export function WithXml<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get xml() {
      return xml(this.text);
    }
    set xml(value: Xml) {
      this.text = value.data;
    }

    updateXml(updater: (value: Xml) => Xml | Promise<Xml>) {
      const updated = awaitSync(updater(this.xml));
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.xml = updated;
    }

    showXml(formatter?: (data: Xml) => any | Promise<any>) {
      let data = this.xml;
      if (formatter) {
        data = awaitSync(formatter(data));
      }

      console.log(data);
    }
  };
}
