import { definePropertiesMutation, mutateClass } from '../../utils/mutation';
import { inspect } from 'util';
import dayjs from 'dayjs';

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
