import { Constructor } from '../interfaces/util';
import { ClassWithUpdateText } from '../interfaces/base';

export function WithReplaceText<T extends Constructor<ClassWithUpdateText>>(
  base: T,
) {
  return class Wrapped extends base {
    async replaceText(
      search: string | RegExp,
      replacer: (substring: string, ...args: any[]) => string,
    ): Promise<boolean>;
    async replaceText(
      search: string | RegExp,
      replacer: string,
    ): Promise<boolean>;
    async replaceText(
      search: string | RegExp,
      replacer: any,
    ): Promise<boolean> {
      let result = false;

      await this.updateText((contents: string) => {
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
