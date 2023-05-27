export type AbstractConstructor<T extends object = {}> = abstract new (
  ...args: any[]
) => T;

export type Constructor<T extends object = {}> = new (...args: any[]) => T;

export type ArrayItem<T extends Array<any>> = T extends (infer U)[] ? U : never;

export type ObjectItem<T extends Record<string, any>> = T extends Record<
  string,
  infer U
>
  ? U
  : never;

export type AnyItem<T> = T extends Array<any>
  ? ArrayItem<T>
  : T extends Record<string, any>
  ? ObjectItem<T>
  : any;

export type AnyKeyType<T> = T extends Array<any> ? number : string;

export type AnyPartial<T> = T extends Array<any>
  ? T
  : T extends Record<string, any>
  ? T
  : Partial<T>;

/**
 * Returns a new version of T where the keys included in K are optional.
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Returns a deep partial type with also all nested object properties optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/**
 * Alternative to the default Omit<T,K> that provides full typing and keeps unions intact.
 *
 * So e.g. if you use TypedOmit<SomeType | OtherType, 'someProperty'> it will produce the same as
 * Omit<SomeType, 'someProperty'> | Omit<OtherType, 'someProperty'>.
 *
 * See: https://stackoverflow.com/a/57103940/4658530
 */
export type TypedOmit<
  TargetType,
  ValuesToOmit extends keyof TargetType,
> = TargetType extends any ? Omit<TargetType, ValuesToOmit> : never;
