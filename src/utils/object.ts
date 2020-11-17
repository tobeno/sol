import { RecordItemType } from '../interfaces/util';

export function sortObjectKeys<T extends Record<string, any>>(obj: T): T {
    return Object.assign(
        Object.create(Object.getPrototypeOf(obj)),
        Object.keys(obj).sort().reduce((result, key) => {
            result[key] = obj[key];

            return result;
        }, {} as any)
    );
}

export function rsortObjectKeys<T extends Record<string, any>>(obj: T): T {
    return Object.assign(
        Object.create(Object.getPrototypeOf(obj)),
        Object.keys(obj).sort().reverse().reduce((result, key) => {
            result[key] = obj[key];

            return result;
        }, {} as any)
    );
}

export function sortObject<T extends Record<string, any>>(obj: T): T {
    return Object.assign(
        Object.create(Object.getPrototypeOf(obj)),
        Object.keys(obj)
            .sort((key1, key2) => {
                const value1 = obj[key1];
                const value2 = obj[key2];

                if (value1 < value2) {
                    return 1;
                }

                if (value1 > value2) {
                    return -1;
                }

                return 0;
            })
            .reduce(
                (result: any, key: string) => {
                    result[key] = obj[key];

                    return result;
                },
                {} as any
            )
    );
}

export function rsortObject<T extends Record<string, any>>(obj: T): T {
    return Object.assign(
        Object.create(Object.getPrototypeOf(obj)),
        Object.keys(obj)
            .sort((key1, key2) => {
                const value1 = obj[key1];
                const value2 = obj[key2];

                if (value1 < value2) {
                    return -1;
                }

                if (value1 > value2) {
                    return 1;
                }

                return 0;
            })
            .reduce(
                (result: any, key: string) => {
                    result[key] = obj[key];

                    return result;
                },
                {} as any
            )
    );
}

export function intersectObjectKeys<T extends Record<string, any>, T2 extends Record<string, any>>(
    obj: T,
    obj2: T2
): Omit<T, keyof Omit<T, keyof T2>> {
    const result: any = {};

    const keys2 = Object.keys(obj2);

    Object.keys(obj).forEach((key) => {
        if (keys2.includes(key)) {
            result[key] = obj[key];
        }
    });

    return result;
}

export function diffObjectKeys<T extends Record<string, any>, T2 extends Record<string, any>>(
    obj: T,
    obj2: T2
): Omit<T, keyof T2> {
    const result: any = {};

    const keys2 = Object.keys(obj2);

    Object.keys(obj).forEach((key) => {
        if (!keys2.includes(key)) {
            result[key] = obj[key];
        }
    });

    return result;
}

export function unionObjectKeys<T extends Record<string, any>, T2 extends Record<string, any>>(
    obj: T,
    obj2: T2
): T & T2 {
    const result: any = {};

    Object.keys(obj2).forEach((key) => {
        result[key] = obj2[key];
    });
    Object.keys(obj).forEach((key) => {
        result[key] = obj[key];
    });

    return result;
}

export function filterObject<T extends Record<string, any>>(
    obj: T,
    cb: (value: RecordItemType<T>, key: string) => boolean = (value: RecordItemType<T>) => !!value
): Partial<T> {
    const result: any = {};

    Object.keys(obj).forEach((key) => {
        if (cb(obj[key], key)) {
            result[key] = obj[key];
        }
    });

    return result;
}

export function rfilterObject<T extends Record<string, any>>(
    obj: T,
    cb: (value: RecordItemType<T>, key: string) => boolean
): Partial<T> {
    return filterObject(obj, (value: any, key: string) => !cb(value, key));
}

export function mapObject<T extends Record<string, any>>(obj: T, cb: (value: any, key: string) => boolean): T {
    const result: any = {};

    Object.keys(obj).forEach((key) => {
        result[key] = cb(obj[key], key);
    });

    return result;
}

export function grepObjectKeys<T extends Record<string, any>>(obj: T, search: string | RegExp): Partial<T> {
    return filterObject(obj, (_: any, key: string) => {
        if (search instanceof RegExp) {
            return search.test(key);
        }

        return key.includes(search);
    });
}

export function rgrepObjectKeys<T extends Record<string, any>>(obj: T, search: string | RegExp): Partial<T> {
    return filterObject(obj, (_: any, key: string) => {
        if (search instanceof RegExp) {
            return !search.test(key);
        }

        return !key.includes(search);
    });
}

export function grepObject<T extends Record<string, any>>(obj: T, search: string | RegExp): Partial<T> {
    return filterObject(obj, (value: any) => {
        value = '' + value;

        if (search instanceof RegExp) {
            return search.test(value);
        }

        return value.includes(search);
    });
}

export function rgrepObject<T extends Record<string, any>>(obj: T, search: string | RegExp): Partial<T> {
    return filterObject(obj, (value: any) => {
        value = '' + value;

        if (search instanceof RegExp) {
            return !search.test(value);
        }

        return !value.includes(search);
    });
}

export function cloneObject<T extends Record<string, any>>(obj: T): T {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

export function camelcaseObject(obj: any, { capitalize }: { capitalize?: boolean } = {}): any {
    if (!obj || typeof obj !== 'object' || obj instanceof Date) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => camelcaseObject(item));
    }

    return Object.keys(obj).reduce(
        (result, key) => {
            const value = obj[key];

            if (capitalize === true) {
                key = key.slice(0, 1).toUpperCase() + key.slice(1);
            } else if (capitalize === false) {
                key = key.slice(0, 1).toLowerCase() + key.slice(1);
            }

            result[key.replace(/_([a-z])/g, (...matches) => matches[1].toUpperCase())] = camelcaseObject(value);

            return result;
        },
        {} as any
    );
}

export function snakecaseObject(obj: any): any {
    if (!obj || typeof obj !== 'object' || obj instanceof Date) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => snakecaseObject(item));
    }

    return Object.keys(obj).reduce(
        (result, key) => {
            const value = obj[key];

            result[
                key.replace(/([a-z])([A-Z])/g, (...matches) => `${matches[1]}_${matches[2].toLowerCase()}`)
            ] = camelcaseObject(value);

            return result;
        },
        {} as any
    );
}
