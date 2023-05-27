import dayjs from 'dayjs';
import { inspect } from 'util';
import { definePropertiesMutation, mutateClass } from './mutation.utils';

declare module 'dayjs' {
  interface Dayjs {
    var(name: string): this;
  }
}

dayjs.extend((_, Dayjs) => {
  mutateClass(
    Dayjs,
    definePropertiesMutation({
      var: {
        value(name: string): any {
          (global as any)[name] = this;

          return this;
        },
      },
      [inspect.custom]: {
        value(): string {
          return `Dayjs { ${this.toISOString()} }`;
        },
      },
    }),
  );
});

export const day = dayjs;
