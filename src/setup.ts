import { globals } from './globals';
import { awaitSync } from './utils/async';
import { sol } from './sol';
import { csv } from './data/csv';
import {
  lines,
  grepLines,
  rgrepLines,
  sortLines,
  rsortLines,
  filterLines,
  rfilterLines,
  replaceLines,
  mapLines,
  extractText,
} from './utils/text';
import { json } from './data/json';
import { html } from './data/html';
import { file } from './storage/file';
import { edit } from './integrations/editor';
import { inspect } from 'util';
import { clipboard } from './os/clipboard';

sol.registerGlobals(globals);

sol.registerProperties(Array.prototype, {
  csv: {
    get() {
      return csv(this);
    },
  },
  unique: {
    value() {
      return [...new Set(this)];
    },
  },
});

sol.registerProperties(String.prototype, {
  lines: {
    get() {
      return lines(String(this));
    },
  },
  json: {
    get() {
      return json(JSON.parse(String(this)));
    },
  },
  data: {
    get() {
      return JSON.parse(String(this));
    },
  },
  csv: {
    get() {
      return csv(String(this));
    },
  },
  html: {
    get() {
      return html(String(this));
    },
  },
  grepLines: {
    value(search: string | RegExp) {
      return grepLines(String(this), search);
    },
    writable: true,
  },
  rgrepLines: {
    value(search: string | RegExp) {
      return rgrepLines(String(this), search);
    },
    writable: true,
  },
  sortLines: {
    value() {
      return sortLines(String(this));
    },
    writable: true,
  },
  rsortLines: {
    value() {
      return rsortLines(String(this));
    },
    writable: true,
  },
  filterLines: {
    value(cb: (line: string) => boolean) {
      return filterLines(String(this), cb);
    },
    writable: true,
  },
  rfilterLines: {
    value(cb: (line: string) => boolean) {
      return rfilterLines(String(this), cb);
    },
    writable: true,
  },
  replaceLines: {
    value(pattern: string | RegExp, replacer: any) {
      return replaceLines(String(this), pattern, replacer);
    },
    writable: true,
  },
  mapLines: {
    value(cb: (line: string) => any) {
      return mapLines(String(this), cb);
    },
    writable: true,
  },
  extract: {
    value(pattern: string | RegExp): string[] {
      return extractText(String(this), pattern);
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
      const f = file(path);
      f.text = String(this);
      return f;
    },
    writable: true,
  },
  edit: {
    value() {
      return edit(String(this));
    },
    writable: true,
  },
  copy: {
    value() {
      clipboard.text = this.toString();
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
