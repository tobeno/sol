import { globals } from './globals';

const globalGeneric = global as any;

Object.assign(globalGeneric, globals);

Object.defineProperties(Object.prototype, {
  json: {
    get() {
      return globals.data.json(this);
    },
  },
});

Object.assign(Object.prototype, {
  file(path: string) {
    globals.data.json(this).file(path);
  },
  vscode() {
    return globals.shell.vscode(this);
  },
  print() {
    console.log(this);
  },
});

Object.defineProperties(Array.prototype, {
  csv: {
    get() {
      return globals.data.csv(this);
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
      return globals.data.json(JSON.parse(String(this)));
    },
  },
  data: {
    get() {
      return JSON.parse(String(this));
    },
  },
  csv: {
    get() {
      return globals.data.csv(String(this));
    },
  },
  html: {
    get() {
      return globals.data.html(String(this));
    },
  },
});

Object.assign(String.prototype as any, {
  grepLines(search: string | RegExp) {
    return globals.utils.grepLines(String(this), search);
  },
  rgrepLines(search: string | RegExp) {
    return globals.utils.rgrepLines(String(this), search);
  },
  sortLines() {
    return globals.utils.sortLines(String(this));
  },
  rsortLines() {
    return globals.utils.rsortLines(String(this));
  },
  filterLines(cb: (line: string) => boolean) {
    return globals.utils.filterLines(String(this), cb);
  },
  rfilterLines(cb: (line: string) => boolean) {
    return globals.utils.rfilterLines(String(this), cb);
  },
  replaceLines(pattern: string | RegExp, replacer: any) {
    return globals.utils.replaceLines(String(this), pattern, replacer);
  },
  print() {
    console.log(String(this));
  },
  file(path: string) {
    const f = globals.storage.file(path);
    f.text = String(this);
    return f;
  },
  vscode() {
    return globals.shell.vscode(String(this));
  },
  copy() {
    globals.os.clipboard.text = this.toString();
  },
});
