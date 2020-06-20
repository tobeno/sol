import { ClassWithText } from '../interfaces/base';
import { Constructor } from '../interfaces/util';
import { awaitPromiseSync } from '../utils/async';

export function WithData<T extends Constructor<ClassWithText>>(base: T) {
    return class Wrapped extends base {
        get data(): any {
            if (super.data) {
                return super.data;
            }

            return JSON.parse(this.text);
        }

        set data(value: any) {
            if (super.data) {
                super.data = value;

                return;
            }

            this.text = JSON.stringify(value, null, 2);
        }

        updateData(updater: (value: any) => any | Promise<any>) {
            const updated = awaitPromiseSync(updater(this.data));
            if (typeof updated === 'undefined') {
                throw new Error('Return value missing from updater');
            }

            this.data = updated;
        }

        showData(formatter?: (value: any) => any | Promise<any>) {
            let value = this.data;
            if (formatter) {
                value = awaitPromiseSync(formatter(value));
            }

            console.log(value);
        }
    };
}
