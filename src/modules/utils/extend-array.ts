import { definePropertiesMutation, mutateClass } from './mutation';

declare global {
  interface Array<T> {
    get unique(): Array<T>;

    log(): void;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    log: {
      value() {
        this.json.log();
      },
    },
    unique: {
      get() {
        return [...new Set(this)];
      },
    },
  }),
);
