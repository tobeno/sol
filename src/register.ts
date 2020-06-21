import { inspect } from 'util';
import { globals } from './globals';
import { awaitSync } from './utils/async';
import { sol } from './sol';

sol.registerGlobals(globals);

sol.registerProperties(Array.prototype, {
  csv: {
    get() {
      return globals.csv(this);
    },
  },
});

sol.registerProperties(String.prototype, {
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
  },
  rgrepLines: {
    value(search: string | RegExp) {
      return globals.utils.rgrepLines(String(this), search);
    },
    writable: true,
  },
  sortLines: {
    value() {
      return globals.utils.sortLines(String(this));
    },
    writable: true,
  },
  rsortLines: {
    value() {
      return globals.utils.rsortLines(String(this));
    },
    writable: true,
  },
  filterLines: {
    value(cb: (line: string) => boolean) {
      return globals.utils.filterLines(String(this), cb);
    },
    writable: true,
  },
  rfilterLines: {
    value(cb: (line: string) => boolean) {
      return globals.utils.rfilterLines(String(this), cb);
    },
    writable: true,
  },
  replaceLines: {
    value(pattern: string | RegExp, replacer: any) {
      return globals.utils.replaceLines(String(this), pattern, replacer);
    },
    writable: true,
  },
  mapLines: {
    value(cb: (line: string) => any) {
      return globals.utils.mapLines(String(this), cb);
    },
    writable: true,
  },
  extract: {
    value(pattern: string | RegExp): string[] {
      return globals.utils.extractText(String(this), pattern);
    },
    writable: true,
  },
  print: {
    value() {
      console.log(String(this));
    },
    writable: true,
  },
  file: {
    value(path: string) {
      const f = globals.file(path);
      f.text = String(this);
      return f;
    },
    writable: true,
  },
  edit: {
    value() {
      return globals.edit(String(this));
    },
    writable: true,
  },
  copy: {
    value() {
      globals.clipboard.text = this.toString();
    },
    writable: true,
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
