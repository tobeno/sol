import path from 'path';
import fs from 'fs';
import { StorageItem } from './storage-item';
import { File } from './file';
import { Text } from '../data/text';
import { grep, replaceText } from './search';
import {
  DirectoryCollection,
  dirs,
  FileCollection,
  files,
  glob,
  StorageItemCollection,
} from './storage-item-collection';
import { exec, spawn } from '../shell/sh';
import { unwrap } from '../../utils/data';
import { MaybeWrapped } from '../../interfaces/data';
import type { Options as PrettierOptions } from 'prettier';

/**
 * Wrapper for a directory.
 */
export class Directory extends StorageItem {
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
    this.renameTo(`${value.path}/${this.basename}`);
  }

  /**
   * Returns the size of the directory in bytes.
   */
  get size(): number {
    const output = unwrap(exec(`du -sL '${this.path}'`));

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
  file(path: string): File {
    return File.create(`${this.path}/${path}`);
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
  dir(path: string): Directory {
    return Directory.create(`${this.path}/${path}`);
  }

  /**
   * Returns all files matching the given (RegExp) pattern in the directory.
   */
  grep(pattern: string | RegExp): FileCollection {
    return grep(pattern, this.path);
  }

  /**
   * Renames / moves the directory to the given path.
   */
  renameTo(newPath: string): this {
    exec(`mv '${this.path}/' '${newPath}/'`);

    this.path = newPath;

    return this;
  }

  /**
   * Copies the directory to the given path.
   */
  copyTo(newPath: string): Directory {
    if (newPath.endsWith('/')) {
      // Copy into
      exec(`cp -r '${this.path}' '${newPath}'`);
    } else {
      // Copy to
      exec(`cp -r '${this.path}/' '${newPath}/'`);
    }

    return Directory.create(newPath);
  }

  /**
   * Serves the directory via HTTP.
   */
  serve(): this {
    spawn(
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
    return replaceText(pattern, replacer, this.path);
  }

  /**
   * Watches the directory for changes.
   */
  watch(fn: (eventType: string, filename: string) => any): () => void {
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
    if (pathOrDirectory instanceof Directory) {
      return pathOrDirectory;
    }

    return new Directory(String(pathOrDirectory));
  }
}
