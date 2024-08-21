import fs from 'fs';
import path from 'path';
import type { Options as PrettierOptions } from 'prettier';
import type { MaybeWrapped } from '../interfaces/wrapper.interfaces';
import {
  dirs,
  files,
  glob,
  grepFiles,
  replaceTextInFiles,
} from '../utils/search.utils';
import { execCommand, spawnCommand } from '../utils/shell.utils';
import { unwrap } from '../utils/wrapper.utils';
import { File } from './file.wrapper';
import { Shell } from './shell.wrapper';
import {
  DirectoryCollection,
  FileCollection,
  StorageItemCollection,
} from './storage-item-collection.wrapper';
import { StorageItem } from './storage-item.wrapper';
import { Text } from './text.wrapper';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Wrapper for a directory.
 */
export class Directory extends StorageItem {
  static readonly usageHelp = `
> dir('.').files('*.md')
> dir('.').grep('dayjs')
> dir('.').open()
  `.trim();

  /**
   * Returns the command to wrap this directory.
   */
  get cmd(): Text {
    return Text.create(`dir(${JSON.stringify(this.path)})`);
  }

  /**
   * Returns the parent directory.
   */
  get parent(): Directory {
    return Directory.create(path.dirname(this.path));
  }

  /**
   * Sets the parent directory.
   */
  set parent(value: Directory) {
    this.renameTo(path.join(value.path, this.basename));
  }

  get shell(): Shell {
    return Shell.create(this.path);
  }

  /**
   * Returns the size of the directory in bytes.
   */
  get size(): number {
    const output = unwrap(execCommand(`du -sL '${this.path}'`));

    return parseInt(output.split(' ')[0], 10);
  }

  /**
   * Returns the name of the directory.
   */
  get name(): string {
    return this.basename;
  }

  /**
   * Sets the name of the directory.
   */
  set name(value: string) {
    this.basename = value;
  }

  /**
   * Returns true if the directory exists.
   */
  get exists(): boolean {
    return fs.existsSync(this.path);
  }

  /**
   * Set to true to ensure the directory exists.
   */
  set exists(value: boolean) {
    if (value) {
      this.create();
    } else {
      throw new Error('Cannot delete directory');
    }
  }

  /**
   * Creates the directory if it does not exist already.
   */
  create(): Directory {
    if (!this.exists) {
      fs.mkdirSync(this.path, {
        recursive: true,
      });
    }

    return this as any;
  }

  /**
   * Returns the path of the directory relative to the given target.
   */
  relativePathFrom(target: string | Directory): string {
    if (target instanceof Directory) {
      target = target.path;
    }

    return path.relative(target, this.path) || '.';
  }

  /**
   * Returns all items in the directory.
   */
  items(exp?: string): StorageItemCollection {
    return glob(path.join(this.path, exp || '*'));
  }

  /**
   * Returns all files in the directory.
   */
  files(exp?: string): FileCollection {
    return files(path.join(this.path, exp || '*'));
  }

  /**
   * Returns the given file in the directory.
   */
  file(filePath: string): File {
    return File.create(path.join(this.path, filePath));
  }

  /**
   * Returns all (sub)directories in the directory.
   */
  dirs(exp?: string): DirectoryCollection {
    return dirs(path.join(this.path, exp || '*'));
  }

  /**
   * Returns the given (sub)directory in the directory.
   */
  dir(dirPath: string): Directory {
    return Directory.create(path.join(this.path, dirPath));
  }

  /**
   * Returns all files matching the given (RegExp) pattern in the directory.
   */
  grep(pattern: string | RegExp): FileCollection {
    return grepFiles(pattern, this.path);
  }

  /**
   * Renames / moves the directory to the given path.
   */
  renameTo(newPath: string): this {
    execCommand(`mv '${this.path}/' '${newPath}/'`);

    this.path = newPath;

    return this;
  }

  /**
   * Copies the directory to the given path.
   */
  copyTo(newPath: string): Directory {
    if (newPath.endsWith('/')) {
      // Copy into
      execCommand(`cp -r '${this.path}' '${newPath}'`);
    } else {
      // Copy to
      execCommand(`cp -r '${this.path}/' '${newPath}/'`);
    }

    return Directory.create(newPath);
  }

  /**
   * Serves the directory via HTTP.
   */
  serve(): this {
    spawnCommand(
      `${path.resolve(__dirname, '../../../node_modules/.bin/serve')}`,
      [this.path],
      {
        stdio: 'inherit',
      },
    );

    return this;
  }

  /**
   * Replaces the given pattern with the replacer in all files in the directory.
   */
  replaceText(pattern: string | RegExp, replacer: any): FileCollection {
    return replaceTextInFiles(pattern, replacer, this.path);
  }

  /**
   * Watches the directory for changes.
   */
  watch(fn: fs.WatchListener<string>): () => void {
    const watcher = fs.watch(
      this.path,
      {
        encoding: 'utf8',
      },
      fn,
    );

    return () => {
      watcher.close();
    };
  }

  /**
   * Prettifies all files in the directory.
   */
  pretty(options: PrettierOptions = {}): void {
    this.files('**').forEach((f) => f.pretty(options));
  }

  static create(pathOrDirectory: MaybeWrapped<string> | Directory): Directory {
    let result: Directory;
    if (pathOrDirectory instanceof Directory) {
      result = pathOrDirectory;
    } else {
      result = new Directory(String(pathOrDirectory));
    }

    return withHelp(
      result,
      `
Directory wrapper around a directory path.

Usage:
${Directory.usageHelp}
    `,
    );
  }
}
