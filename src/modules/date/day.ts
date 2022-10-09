import { definePropertiesMutation, mutateClass } from '../../utils/mutation';
import { inspect } from 'util';
import dayjs from 'dayjs';

dayjs.extend((_, Dayjs) => {
  mutateClass(
    Dayjs,
    definePropertiesMutation({
      as: {
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
