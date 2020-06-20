import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';
import {
    lines,
    grepLines,
    rgrepLines,
    sortLines,
    rsortLines,
    filterLines,
    rfilterLines,
    replaceLines,
    mapLines
} from '../utils/text';
import { awaitPromiseSync } from '../utils/async';

export function WithText<T extends Constructor<ClassWithText>>(base: T) {
    return class Wrapped extends base {
        grepLines(search: string | RegExp) {
            return this.updateText((data) => {
                data = grepLines(data, search);

                return data;
            });
        }

        rgrepLines(search: string | RegExp) {
            return this.updateText((data) => {
                data = rgrepLines(data, search);

                return data;
            });
        }

        sortLines() {
            return this.updateText((data) => {
                data = sortLines(data);

                return data;
            });
        }

        rsortLines() {
            return this.updateText((data) => {
                data = rsortLines(data);

                return data;
            });
        }

        filterLines(cb: (line: string) => boolean) {
            return this.updateText((data) => {
                data = filterLines(data, cb);

                return data;
            });
        }

        rfilterLines(cb: (line: string) => boolean) {
            return this.updateText((data) => {
                data = rfilterLines(data, cb);

                return data;
            });
        }

        replaceLines(pattern: string | RegExp, replacer: any) {
            return this.updateText((data) => {
                data = replaceLines(data, pattern, replacer);

                return data;
            });
        }

        mapLines(cb: (line: string) => any) {
            return mapLines(this.text, cb);
        }

        updateLines(updater: (value: string) => string | Promise<string>) {
            const updated = awaitPromiseSync(Promise.all(lines(this.text).map(updater)));
            if (typeof updated === 'undefined') {
                throw new Error('Return value missing from updater');
            }

            this.text = updated.join('\n') + '\n';

            return this.text;
        }

        updateText(updater: (value: string) => string | Promise<string>) {
            const updated = awaitPromiseSync(updater(this.text));
            if (typeof updated === 'undefined') {
                throw new Error('Return value missing from updater');
            }

            this.text = updated;

            return this.text;
        }

        showText(formatter?: (text: string) => any | Promise<any>) {
            let text = this.text;
            if (formatter) {
                text = awaitPromiseSync(formatter(text));
            }

            console.log(text);
        }
    };
}
