export type FromPropertyDescriptorMap<T extends PropertyDescriptorMap> = {
  [key in keyof T]: T[key] extends { value: any }
    ? T[key]['value']
    : T[key] extends { get(): any }
      ? ReturnType<T[key]['get']>
      : T[key] extends { set(value: any): void }
        ? Parameters<T[key]['set']>[0]
        : T[key];
};
