import { withHelp } from './metadata';

export const filterLines = withHelp(
  (
    str: string,
    cb: (line: string) => boolean = (line: string) => !!line,
  ): string => {
    return str.replace(/(.*)(\r?\n|$)/g, (...matches: string[]) => {
      if (!cb(matches[1])) {
        return '';
      }

      return matches[0];
    });
  },
  'Removes lines using a filter function',
);

export const rfilterLines = (
  str: string,
  cb: (line: string) => boolean,
): string => {
  return filterLines(str, (line: string) => !cb(line));
};

export const grepLines = (str: string, search: string | RegExp): string => {
  return filterLines(str, (line: string) => {
    if (search instanceof RegExp) {
      return search.test(line);
    }

    return line.includes(search);
  });
};

export const rgrepLines = (str: string, search: string | RegExp): string => {
  return filterLines(str, (line: string) => {
    if (search instanceof RegExp) {
      return !search.test(line);
    }

    return !line.includes(search);
  });
};

export const lines = (str: string): string[] => {
  return str.replace(/\r/g, '').trimEnd().split('\n');
};

export const sortLines = (str: string): string => {
  return lines(str).sort().join('\n') + '\n';
};

export const rsortLines = (str: string): string => {
  return lines(str).sort().reverse().join('\n') + '\n';
};

export const replaceLines = (
  str: string,
  pattern: string | RegExp,
  replacer: any,
) => {
  return (
    lines(str)
      .map((line) => line.replace(pattern, replacer))
      .join('\n') + '\n'
  );
};

export const mapLines = (str: string, cb: (line: string) => any) => {
  return lines(str).map(cb).join('\n') + '\n';
};

export const extractText = (str: string, pattern: RegExp | string) => {
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern, 'g');
  } else if (!pattern.global) {
    pattern = new RegExp(pattern.source, pattern.flags + 'g');
  }

  return [...new Set(str.match(pattern) || [])].sort();
};

export function camelcaseText(
  key: string,
  {
    capitalize = false,
    includeConstantCase = false,
  }: { capitalize?: boolean | null; includeConstantCase?: boolean | null } = {},
): string {
  if (includeConstantCase || !/^[A-Z0-9_]+$/.test(key)) {
    key = key.replace(/_([a-z0-9])/g, (...matches) => matches[1].toUpperCase());

    if (capitalize === true) {
      key = key.slice(0, 1).toUpperCase() + key.slice(1);
    } else if (capitalize === false) {
      key = key
        .replace(
          /^([A-Z])([a-z0-9])/g,
          (...matches) => `${matches[1].toLowerCase()}${matches[2]}`,
        )
        .replace(
          /^([A-Z]+)([A-Z])/g,
          (...matches) => `${matches[1].toLowerCase()}${matches[2]}`,
        );
    }
  }

  return key;
}

export function snakecaseText(str: string): string {
  return str.replace(
    /([a-z0-9])([A-Z])/g,
    (...matches) => `${matches[1]}_${matches[2].toLowerCase()}`,
  );
}
