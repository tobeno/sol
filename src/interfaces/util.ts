export interface Constructor<T extends object = {}> {
  new (...args: any[]): T;
}
