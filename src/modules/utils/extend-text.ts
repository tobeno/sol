import { definePropertiesMutation, mutateClass } from './mutation';
import { Data } from '../data/data';
import { log } from './log';
import { wrapObject, wrapString } from '../data/transformer';
import {
  extractText,
  filterLines,
  grepLines,
  lines,
  mapLines,
  replaceLines,
  rfilterLines,
  rgrepLines,
  rsortLines,
  sortLines,
} from './text';
import { Text } from '../data/text';

declare module '../data/text' {
  interface Text<ContentType> {
    log(): void;

    get lines(): Data<string[]>;

    grepLines(search: string | RegExp): Text<ContentType>;

    rgrepLines(search: string | RegExp): Text<ContentType>;

    sortLines(): Text<ContentType>;

    rsortLines(): Text<ContentType>;

    filterLines(cb: (line: string) => boolean): Text<ContentType>;

    rfilterLines(cb: (line: string) => boolean): Text<ContentType>;

    replaceLines(pattern: string | RegExp, replacer: any): Text<ContentType>;

    mapLines(cb: (line: string) => any): Text<ContentType>;

    extract(pattern: string | RegExp): Data<Text[]>;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    log: {
      value(): void {
        log(String(this));
      },
    },
    lines: {
      get(): Data<string[]> {
        return wrapObject(lines(this.toString()), this);
      },
    },
    grepLines: {
      value(search: string | RegExp): Text<any> {
        return wrapString(grepLines(String(this), search), this.format, this);
      },
    },
    rgrepLines: {
      value(search: string | RegExp): Text<any> {
        return wrapString(rgrepLines(String(this), search), this.format, this);
      },
    },
    sortLines: {
      value(): Text<any> {
        return wrapString(sortLines(String(this)), this.format, this);
      },
    },
    rsortLines: {
      value(): Text<any> {
        return wrapString(rsortLines(String(this)), this.format, this);
      },
    },
    filterLines: {
      value(cb: (line: string) => boolean): Text<any> {
        return wrapString(filterLines(String(this), cb), this.format, this);
      },
    },
    rfilterLines: {
      value(cb: (line: string) => boolean): Text<any> {
        return wrapString(rfilterLines(String(this), cb), this.format, this);
      },
    },
    replaceLines: {
      value(pattern: string | RegExp, replacer: any): Text<any> {
        return wrapString(
          replaceLines(String(this), pattern, replacer),
          this.format,
          this,
        );
      },
    },
    mapLines: {
      value(cb: (line: string) => any): Text<any> {
        return wrapString(mapLines(String(this), cb), this.format, this);
      },
    },
    extract: {
      value(pattern: string | RegExp): Data<Text[]> {
        return wrapObject(
          extractText(String(this), pattern).map((s) => wrapString(s)),
          this,
        );
      },
    },
  }),
);
