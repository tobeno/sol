import * as path from 'path';
import * as fs from 'fs';
import { Item } from './item';
import { File } from './file';
import { files, glob, dirs, grep, replaceText } from './fn';
import { ItemCollection } from './item-collection';
import { exec } from '../shell/fn';
import { WithPrint } from '../extensions/print';
import { WithCopy } from '../extensions/copy';

export class UnwrappedDirectory extends Item {
  get parent(): Directory {
    return new Directory(path.dirname(this.path));
  }

  get size(): number {
    const output = exec(`du -sL '${this.path}'`);

    return parseInt(output.split(' ')[0], 10);
  }

  create() {
    fs.mkdirSync(this.path, {
      recursive: true,
    });
  }

  files(exp?: string): ItemCollection<File> {
    return files(path.join(this.path, exp || '*'));
  }

  file(exp?: string): File | null {
    const files = this.files(exp);

    return files.length ? files[0] : null;
  }

  dirs(exp?: string): ItemCollection<Directory> {
    return dirs(path.join(this.path, exp || '*'));
  }

  dir(exp?: string): Directory | null {
    const dirs = this.dirs(exp);

    return dirs.length ? dirs[0] : null;
  }

  grep(pattern: string | RegExp): ItemCollection<File> {
    return grep(pattern, this.path);
  }

  glob(exp?: string): ItemCollection<File | Directory> {
    return glob(path.join(this.path, exp || '*'));
  }

  serve() {
    exec(
      `${path.resolve(__dirname, '../../node_modules/.bin/serve')} ${
        this.path
      }`,
    );
  }

  async replaceText(
    pattern: string | RegExp,
    replacer: any,
  ): Promise<ItemCollection<File>> {
    return replaceText(pattern, replacer, this.path);
  }

  toString() {
    return this.files()
      .map((file) => file.toString())
      .join('\n');
  }
}

export class Directory extends WithPrint(WithCopy(UnwrappedDirectory)) {}
