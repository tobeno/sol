import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'shelljs';
import { Item } from './item';
import { file } from './file';
import { grep, replaceText } from './search';
import {
  files,
  glob,
  dirs,
  FileCollection,
  DirectoryCollection,
  ItemCollection,
} from './item-collection';
import { WithPrint } from '../wrappers/with-print';
import { WithCopy } from '../wrappers/with-copy';

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

  get exists(): boolean {
    return fs.existsSync(this.path);
  }

  set exists(value: boolean) {
    if (value) {
      this.create();
    } else {
      throw new Error('Cannot delete directory');
    }
  }

  create(): Directory {
    if (!this.exists) {
      fs.mkdirSync(this.path, {
        recursive: true,
      });
    }

    return this as any;
  }

  items(): ItemCollection {
    return this.glob();
  }

  files(exp?: string): FileCollection {
    return files(path.join(this.path, exp || '*'));
  }

  file(path: string) {
    return file(`${this.path}/${path}`);
  }

  dirs(exp?: string): DirectoryCollection {
    return dirs(path.join(this.path, exp || '*'));
  }

  dir(path: string) {
    return dir(`${this.path}/${path}`);
  }

  grep(pattern: string | RegExp): FileCollection {
    return grep(pattern, this.path);
  }

  glob(exp?: string): ItemCollection {
    return glob(path.join(this.path, exp || '*'));
  }

  moveTo(newPath: string | Directory) {
    if (newPath instanceof Directory) {
      newPath = `${newPath.path}/`;
    }

    if (newPath.endsWith('/')) {
      // Copy into
      exec(`mv '${this.path}' '${newPath}'`);
    } else {
      // Copy to
      exec(`mv '${this.path}/' '${newPath}/'`);
    }

    this.path = newPath;

    return this;
  }

  copyTo(newPath: string) {
    if (newPath.endsWith('/')) {
      // Copy into
      exec(`cp -r '${this.path}' '${newPath}'`);
    } else {
      // Copy to
      exec(`cp -r '${this.path}/' '${newPath}/'`);
    }

    return new Directory(newPath);
  }

  renameTo(newBasename: string) {
    return this.moveTo(`${this.parent.path}/${newBasename}`);
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

  pretty() {
    this.files('**').forEach((f) => f.pretty());
  }
}

export class Directory extends WithPrint(WithCopy(UnwrappedDirectory)) {}

export function dir(path?: string): Directory {
  return new Directory(path || '.');
}
