import { isNotEmpty } from '../../utils/core';
import { exec } from '../../utils/sh';
import { File } from './file';
import { FileCollection } from './storage-item-collection';

/**
 * Returns all files matching the given (RegExp) pattern.
 */
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
      .filter((file) => isNotEmpty(file))
      .map((file) => File.create(file)),
  );
}

/**
 * Replaces the given pattern with the replacement in all files.
 */
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
