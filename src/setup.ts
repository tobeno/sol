import { globals } from './globals';
import { awaitSync } from './utils/async';
import { sol } from './sol';
import { inspect } from 'util';
import { dataToCsv, dataToJson, dataToYaml } from './data/transformer';

sol.registerGlobals(globals);

sol.registerProperties(Array.prototype, {
  csv: {
    get() {
      return dataToCsv(this);
    },
  },
  json: {
    get() {
      return dataToJson(this);
    },
  },
  yaml: {
    get() {
      return dataToYaml(this);
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
