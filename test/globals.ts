import type { FromPropertyDescriptorMap } from '../dist/src/interfaces/object';

export const globals = {
  example: {
    value(): string {
      return 'Hello world!';
    },
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;
