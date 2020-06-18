import * as fg from 'fast-glob';
import { fileSync as tmpFileSync } from 'tmp';
import { File } from './file';
import { Directory } from './directory';
import { ItemCollection } from './item-collection';
import { exec } from 'shelljs';

export function file(path: string): File {
  return new File(path);
}

export function dir(path?: string): Directory {
  return new Directory(path || '.');
}

export function grep(
  pattern: string | RegExp,
  path?: string,
): ItemCollection<File> {
  return new ItemCollection<File>(
    ...exec(
      `egrep -rl '${(pattern instanceof RegExp ? pattern.source : pattern)
        .replace(/'/g, "\\'")
        .replace('\n', '\\n')}' ${path || '.'} || true`,
    )
      .split('\n')
      .filter((file) => !!file)
      .map((file) => new File(file)),
  );
}

export function files(
  exp?: string,
  options: fg.Options = {},
): ItemCollection<File> {
  return new ItemCollection<File>(
    ...fg
      .sync(exp || '*', {
        dot: true,
        ...options,
        objectMode: true,
        onlyFiles: true,
      })
      .map((file) => {
        return new File(file.path);
      }),
  );
}

export function dirs(
  exp?: string,
  options: fg.Options = {},
): ItemCollection<Directory> {
  return new ItemCollection<Directory>(
    ...fg
      .sync(exp || '*', {
        dot: true,
        ...options,
        objectMode: true,
        onlyDirectories: true,
      })
      .map((file) => {
        return new Directory(file.path);
      }),
  );
}

export function glob(
  exp?: string,
  options: fg.Options = {},
): ItemCollection<Directory | File> {
  return new ItemCollection<File | Directory>(
    ...files(exp, options),
    ...dirs(exp, options),
  );
}

export function tmp(ext?: string): File {
  return new File(
    tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    }).name,
  );
}

export async function replaceText(
  pattern: string | RegExp,
  replacer: any,
  path?: string,
): Promise<ItemCollection<File>> {
  const files = grep(pattern, path);

  Promise.all(
    files.map((file) => {
      file.replaceText(pattern, replacer);
    }),
  );

  return files;
}
