import { File } from './file';
import { FileCollection } from './item-collection';
import { exec } from 'shelljs';

export function grep(pattern: string | RegExp, path?: string): FileCollection {
  return new FileCollection(
    exec(
      `egrep -rl '${(pattern instanceof RegExp ? pattern.source : pattern)
        .replace(/'/g, "\\'")
        .replace('\n', '\\n')}' ${path || '.'} || true`,
    )
      .split('\n')
      .filter((file) => !!file)
      .map((file) => new File(file)),
  );
}

export function replaceText(
  pattern: string | RegExp,
  replacer: any,
  path?: string,
): FileCollection {
  const files = grep(pattern, path);

  files.map((file) => {
    file.replaceText(pattern, replacer);
  });

  return files;
}
