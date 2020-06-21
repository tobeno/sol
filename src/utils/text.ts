export function filterLines(
  str: string,
  cb: (line: string) => boolean = (line: string) => !!line,
): string {
  return str.replace(/(.*)(\r?\n|$)/g, (...matches: string[]) => {
    if (!cb(matches[1])) {
      return '';
    }

    return matches[0];
  });
}

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

export function lines(str: string): string[] {
  return str.replace(/\r/g, '').trimEnd().split('\n');
}

export function sortLines(str: string): string {
  return lines(str).sort().join('\n') + '\n';
}

export function rsortLines(str: string): string {
  return lines(str).sort().reverse().join('\n') + '\n';
}

export function replaceLines(
  str: string,
  pattern: string | RegExp,
  replacer: any,
) {
  return (
    lines(str)
      .map((line) => line.replace(pattern, replacer))
      .join('\n') + '\n'
  );
}

export function mapLines(str: string, cb: (line: string) => any) {
  return lines(str).map(cb);
}

export function extractText(str: string, pattern: RegExp | string) {
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern, 'g');
  } else if (!pattern.global) {
    pattern = new RegExp(pattern.source, pattern.flags + 'g');
  }

  return [...new Set(str.match(pattern) || [])].sort();
}
