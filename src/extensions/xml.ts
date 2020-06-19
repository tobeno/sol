import { Xml , xml} from '../data/xml';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';

export function WithXml<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get xml() {
      return xml(this.text);
    }
    set xml(value: Xml) {
      this.text = value.text;
    }

    async updateXml(
      updater: (value: Xml) => Xml | Promise<Xml>,
    ): Promise<void> {
      const updated = await updater(this.xml);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.xml = updated;
    }

    async showXml(
      formatter?: (data: Xml) => any | Promise<any>,
    ): Promise<void> {
      let data = this.xml;
      if (formatter) {
        data = await formatter(data);
      }

      console.log(data);
    }
  };
}
