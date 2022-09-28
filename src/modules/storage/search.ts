import { exec } from '../shell/sh';
import { File } from './file';
import { FileCollection } from './storage-item-collection';

export function grep(pattern: string | RegExp, path?: string): FileCollection {
  return FileCollection.create(
    exec(
      `egrep -rl '${(pattern instanceof RegExp ? pattern.source : pattern)
        .replace(/'/g, "\\'")
        .replace('\n', '\\n')}' '${path || '.'}' || true`,
      {
        silent: true,
      },
    )
      .split('\n')
      .filter((file) => !!file)
      .map((file) => File.create(file)),
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
