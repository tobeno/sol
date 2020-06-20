import { Constructor } from '../interfaces/util';
import { ClassWithUpdateText } from '../interfaces/base';

export function WithReplaceText<T extends Constructor<ClassWithUpdateText>>(
  base: T,
) {
  return class Wrapped extends base {
    replaceText(
      search: string | RegExp,
      replacer: (substring: string, ...args: any[]) => string,
    ): boolean;
    replaceText(search: string | RegExp, replacer: string): boolean;
    replaceText(search: string | RegExp, replacer: any): boolean {
      let result = false;

      this.updateText((contents: string) => {
        const oldContents = contents;

        contents = contents.replace(search, replacer);

        if (oldContents !== contents) {
          result = true;
        }

        return contents;
      });

      return result;
    }
  };
}
