import fg from 'fast-glob';
import { Directory } from '../wrappers/directory.wrapper';
import { File } from '../wrappers/file.wrapper';
import {
  DirectoryCollection,
  FileCollection,
  StorageItemCollection,
} from '../wrappers/storage-item-collection.wrapper';
import { isNotEmpty } from './core.utils';
import { Shell } from '../wrappers/shell.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

/**
 * Returns all files matching the given (RegExp) pattern.
 */
export function grepFiles(
  pattern: string | RegExp,
  path?: string,
): FileCollection {
  return FileCollection.create(
    Shell.create(path)
      .grep(pattern, {
        list: true,
      })
      .filter((file) => isNotEmpty(file))
      .map((file) => File.create(file)),
  );
}

/**
 * Replaces the given pattern with the replacement in all files.
 */
export function replaceTextInFiles(
  pattern: string | RegExp,
  replacer: any,
  path?: string,
): FileCollection {
  const files = grepFiles(pattern, path);

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
