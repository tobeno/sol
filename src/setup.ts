import { globals } from './globals';
import { awaitSync } from './utils/async';
import { sol } from './sol';
import { inspect } from 'util';
import { map } from './data/mapper';
import { DataTransformation } from './data/data-transformation';
import { DataType } from './data/data-type';
import { DataFormat } from './data/data-format';

sol.registerGlobals(globals);

sol.registerProperties(Array.prototype, {
  csv: {
    get() {
      return map(
        this,
        new DataTransformation(
          DataType.Object,
          DataType.String.withFormat(DataFormat.Csv),
        ),
      );
    },
  },
  json: {
    get() {
      return map(
        this,
        new DataTransformation(
          DataType.Object,
          DataType.String.withFormat(DataFormat.Json),
        ),
      );
    },
  },
  copy: {
    get() {
      return this.json.copy();
    },
  },
  print: {
    get() {
      return this.json.print();
    },
  },
  unique: {
    value() {
      return [...new Set(this)];
    },
  },
});

sol.registerProperties(Promise.prototype, {
  await: {
    get() {
      return awaitSync(this);
    },
  },
  toString: {
    value() {
      return String(this.await);
    },
  },
  [inspect.custom]: {
    value() {
      const value = this.await;

      if (value[inspect.custom]) {
        return value[inspect.custom]();
      }

      return String(value);
    },
  },
});
