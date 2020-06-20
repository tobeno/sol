import { inspect } from 'util';
import { globals } from './globals';
import { awaitPromiseSync } from './utils/async';

const globalGeneric = global as any;

Object.assign(globalGeneric, globals);

Object.defineProperties(Object.prototype, {
  json: {
    get() {
      return globals.json(this);
    },
  },
  file: {
    value(path: string) {
      globals.json(this).file(path);
    },
    writable: true,
    enumerable: false,
  },
  vscode: {
    value() {
      return globals.vscode(this);
    },
    writable: true,
    enumerable: false,
  },
  print: {
    value() {
      console.log(this);
    },
    writable: true,
    enumerable: false,
  },
});

Object.defineProperties(Array.prototype, {
  csv: {
    get() {
      return globals.csv(this);
    },
  },
});

Object.defineProperties(String.prototype, {
  lines: {
    get() {
      return globals.utils.lines(String(this));
    },
  },
  json: {
    get() {
      return globals.json(JSON.parse(String(this)));
    },
  },
  data: {
    get() {
      return JSON.parse(String(this));
    },
  },
  csv: {
    get() {
      return globals.csv(String(this));
    },
  },
  html: {
    get() {
      return globals.html(String(this));
    },
  },
  grepLines: {
    value(search: string | RegExp) {
      return globals.utils.grepLines(String(this), search);
    },
    writable: true,
    enumerable: false,
  },
  rgrepLines: {
    value(search: string | RegExp) {
      return globals.utils.rgrepLines(String(this), search);
    },
    writable: true,
    enumerable: false,
  },
  sortLines: {
    value() {
      return globals.utils.sortLines(String(this));
    },
    writable: true,
    enumerable: false,
  },
  rsortLines: {
    value() {
      return globals.utils.rsortLines(String(this));
    },
    writable: true,
    enumerable: false,
  },
  filterLines: {
    value(cb: (line: string) => boolean) {
      return globals.utils.filterLines(String(this), cb);
    },
    writable: true,
    enumerable: false,
  },
  rfilterLines: {
    value(cb: (line: string) => boolean) {
      return globals.utils.rfilterLines(String(this), cb);
    },
    writable: true,
    enumerable: false,
  },
  replaceLines: {
    value(pattern: string | RegExp, replacer: any) {
      return globals.utils.replaceLines(String(this), pattern, replacer);
    },
    writable: true,
    enumerable: false,
  },
  mapLines: {
    value(cb: (line: string) => any) {
      return globals.utils.mapLines(String(this), cb);
    },
    writable: true,
    enumerable: false,
  },
  print: {
    value() {
      console.log(String(this));
    },
    writable: true,
    enumerable: false,
  },
  file: {
    value(path: string) {
      const f = globals.file(path);
      f.text = String(this);
      return f;
    },
    writable: true,
    enumerable: false,
  },
  vscode: {
    value() {
      return globals.vscode(String(this));
    },
    writable: true,
    enumerable: false,
  },
  copy: {
    value() {
      globals.clipboard.text = this.toString();
    },
    writable: true,
    enumerable: false,
  },
});

Object.defineProperties(Promise.prototype, {
  await: {
    get() {
      return awaitPromiseSync(this);
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
