import fg from 'fast-glob';
import { Directory } from '../wrappers/directory.wrapper';
import { File } from '../wrappers/file.wrapper';
import {
  DirectoryCollection,
  FileCollection,
  StorageItemCollection,
} from '../wrappers/storage-item-collection.wrapper';
import { isNotEmpty } from './core.utils';
import { exec } from './sh.utils';

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

/**
 * Returns all files matching the given glob pattern.
 */
export function files(exp?: string, options: fg.Options = {}): FileCollection {
  return FileCollection.create(
    require('fast-glob')
      .sync(exp || '*', {
        dot: true,
        ...options,
        objectMode: true,
        onlyFiles: true,
      })
      .map((file: fg.Entry) => {
        return File.create(file.path);
      }),
  );
}

/**
 * Returns all directories matching the given glob pattern.
 */
export function dirs(
  exp?: string,
  options: fg.Options = {},
): DirectoryCollection {
  return DirectoryCollection.create(
    require('fast-glob')
      .sync(exp || '*', {
        dot: true,
        ...options,
        objectMode: true,
        onlyDirectories: true,
      })
      .map((file: fg.Entry) => {
        return Directory.create(file.path);
      }),
  );
}

/**
 * Returns all files and directories matching the given glob pattern.
 */
export function glob(
  exp?: string,
  options: fg.Options = {},
): StorageItemCollection {
  return StorageItemCollection.create([
    ...files(exp, options).value,
    ...dirs(exp, options).value,
  ]);
}
