import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'shelljs';
import { Item } from './item';
import { File } from './file';
import { grep, replaceText } from './search';
import {
  files,
  glob,
  dirs,
  FileCollection,
  DirectoryCollection,
  ItemCollection,
} from './item-collection';
import { WithPrint } from '../extensions/print';
import { WithCopy } from '../extensions/copy';
import { WithFiles } from '../extensions/files';

export class UnwrappedDirectory extends Item {
  get parent(): Directory {
    return new Directory(path.dirname(this.path));
  }

  set parent(value: Directory) {
    this.moveTo(`${value.path}/${this.basename}`);
  }

  get size(): number {
    const output = exec(`du -sL '${this.path}'`);

    return parseInt(output.split(' ')[0], 10);
  }

  get name(): string {
    return this.basename;
  }

  set name(value: string) {
    this.basename = value;
  }

  create() {
    fs.mkdirSync(this.path, {
      recursive: true,
    });

    return this;
  }

  moveTo(newPath: string | Directory) {
    if (newPath instanceof Directory) {
      newPath = `${newPath.path}/${this.basename}`;
    }

    fs.renameSync(this.path, newPath);

    this.path = newPath;

    return this;
  }

  renameTo(newBasename: string) {
    return this.moveTo(`${this.parent.path}/${newBasename}`);
  }

  files(exp?: string): FileCollection {
    return files(path.join(this.path, exp || '*'));
  }

  file(exp?: string): File | null {
    const files = this.files(exp);

    return files.length ? files[0] : null;
  }

  dirs(exp?: string): DirectoryCollection {
    return dirs(path.join(this.path, exp || '*'));
  }

  dir(exp?: string): Directory | null {
    const dirs = this.dirs(exp);

    return dirs.length ? dirs[0] : null;
  }

  grep(pattern: string | RegExp): FileCollection {
    return grep(pattern, this.path);
  }

  glob(exp?: string): ItemCollection {
    return glob(path.join(this.path, exp || '*'));
  }

  serve() {
    exec(
      `${path.resolve(__dirname, '../../node_modules/.bin/serve')} ${
        this.path
      }`,
    );

    return this;
  }

  replaceText(pattern: string | RegExp, replacer: any): FileCollection {
    return replaceText(pattern, replacer, this.path);
  }

  toString() {
    return this.files()
      .map((file) => file.toString())
      .join('\n');
  }
}

export class Directory extends WithFiles(
  WithPrint(WithCopy(UnwrappedDirectory)),
) {}

export function dir(path?: string): Directory {
  return new Directory(path || '.');
}
