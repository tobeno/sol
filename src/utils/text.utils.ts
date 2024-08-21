import * as changeCase from 'change-case';
import { isNotEmpty } from './core.utils';
import { withHelp } from './metadata.utils';

export function lines(str: string): string[] {
  return str.replace(/\r/g, '').trimEnd().split('\n');
}

export function mapLines(str: string, cb: (line: string) => any): string {
  return lines(str).map(cb).join('\n') + (str.endsWith('\n') ? '\n' : '');
}

export function sortLines(str: string): string {
  return lines(str).sort().join('\n') + (str.endsWith('\n') ? '\n' : '');
}

export function rsortLines(str: string): string {
  return (
    lines(str).sort().reverse().join('\n') + (str.endsWith('\n') ? '\n' : '')
  );
}

export const filterLines = withHelp(
  (str: string, cb: (line: string) => boolean = isNotEmpty): string => {
    let result = str.replace(/(.*)(\r?\n|$)/g, (...matches: string[]) => {
      if (!cb(matches[1])) {
        return '';
      }

      return matches[0];
    });

    if (!str.endsWith('\n') && result.endsWith('\n')) {
      result = result.slice(0, -1);
    }

    if (result.endsWith('\r')) {
      result = result.slice(0, -1);
    }

    return result;
  },
  'Removes lines using a filter function.',
);

export function rfilterLines(
  str: string,
  cb: (line: string) => boolean,
): string {
  return filterLines(str, (line: string) => !cb(line));
}

export function grepLines(str: string, search: string | RegExp): string {
  return filterLines(str, (line: string) => {
    if (search instanceof RegExp) {
      return search.test(line);
    }

    return line.includes(search);
  });
}

export function rgrepLines(str: string, search: string | RegExp): string {
  return filterLines(str, (line: string) => {
    if (search instanceof RegExp) {
      return !search.test(line);
    }

    return !line.includes(search);
  });
}

export function replaceLines(
  str: string,
  pattern: string | RegExp,
  replacer: any,
) {
  return (
    lines(str)
      .map((line) => line.replace(pattern, replacer))
      .join('\n') + (str.endsWith('\n') ? '\n' : '')
  );
}

export function extractText(str: string, pattern: RegExp | string): string[] {
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern, 'g');
  } else if (!pattern.global) {
    pattern = new RegExp(pattern.source, pattern.flags + 'g');
  }

  return [...str.matchAll(pattern)].map((match) => match[0]);
}

export function capitalizeText(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function decapitalizeText(str: string): string {
  return str.slice(0, 1).toLowerCase() + str.slice(1);
}

export function pascalcaseText(str: string): string {
  return changeCase.pascalCase(str);
}

export function camelcaseText(
  str: string,
  {
    capitalize = false,
    includeConstantCase = false,
  }: { capitalize?: boolean | null; includeConstantCase?: boolean | null } = {},
): string {
  if (includeConstantCase || !/^[A-Z0-9_]+$/.test(str)) {
    str = changeCase.camelCase(str);

    if (capitalize === true) {
      str = capitalizeText(str);
    } else if (capitalize === false) {
      str = str
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

  return str;
}

export function titlecaseText(str: string): string {
  return changeCase.capitalCase(str);
}

export function kebabcaseText(str: string): string {
  return changeCase.kebabCase(str);
}

export function constantcaseText(str: string): string {
  return changeCase.constantCase(str);
}

export function snakecaseText(str: string): string {
  return changeCase.snakeCase(str);
}
