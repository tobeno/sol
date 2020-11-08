export interface Constructor<T extends object = {}> {
  new (...args: any[]): T;
}

export type ArrayItemType<T extends Array<any>> = T extends (infer U)[]
  ? U
  : never;

export type RecordItemType<T extends Record<string, any>> = T extends Record<
  string,
  infer U
>
  ? U
  : never;

export type AnyItemType<T> = T extends Array<any>
  ? ArrayItemType<T>
  : T extends Record<string, any>
  ? RecordItemType<T>
  : any;

export type AnyKeyType<T> = T extends Array<any> ? number : string;

export type AnyPartial<T> = T extends Array<any>
  ? T
  : T extends Record<string, any>
  ? T
  : Partial<T>;
