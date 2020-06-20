import { Directory } from './directory';
import { File } from './file';
import { grep } from './search';
import { clipboard } from '../os/clipboard';
import { Item } from './item';
import * as fg from 'fast-glob';
import { awaitSync } from '../utils/async';

export class GenericItemCollection<ItemType extends Item> extends Array<
  ItemType
> {
  get size(): number {
    let result = 0;

    this.forEach((item) => {
      if (item instanceof Directory || item instanceof File) {
        result += item.size;
      }
    });

    return result;
  }

  get exts(): string[] {
    return [...new Set(Array.from(this.files()).map((f) => f.ext))].sort();
  }

  get names(): string[] {
    return [...new Set(Array.from(this).map((i) => i.name))].sort();
  }

  get basenames(): string[] {
    return [...new Set(Array.from(this).map((i) => i.basename))].sort();
  }

  files(exp?: string): FileCollection {
    let result: File[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp));
      } else if (!exp && item instanceof File) {
        result.push(item);
      }
    });

    return new FileCollection(...result);
  }

  dirs(): DirectoryCollection {
    let result: Directory[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.push(item);
      }
    });

    return new DirectoryCollection(...result);
  }

  items(): ItemCollection {
    return this as any;
  }

  glob(exp: string): ItemCollection {
    let result: (File | Directory)[] = [];

    this.map((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp));
      }
    });

    return new ItemCollection(...result);
  }

  grep(pattern: string | RegExp): FileCollection {
    const result: File[] = [];

    this.map((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.grep(pattern));
      } else if (item instanceof File) {
        if (grep(pattern, item.path).length) {
          result.push(item);
        }
      }
    });

    return new FileCollection(...result);
  }

  updateName(
    cb: (name: string) => string | Promise<string>,
  ): AnyItemCollection {
    this.forEach((f) => (f.name = awaitSync(cb(f.name))));

    return this as any;
  }

  updateBasename(
    cb: (basename: string) => string | Promise<string>,
  ): AnyItemCollection {
    this.forEach((f) => (f.basename = awaitSync(cb(f.basename))));

    return this as any;
  }

  replaceText(pattern: string | RegExp, replacer: any): AnyItemCollection {
    const result: File[] = [];

    this.items()
      .files()
      .forEach(async (item) => {
        if (item instanceof Directory) {
          result.splice(
            result.length,
            0,
            ...(await item.replaceText(pattern, replacer)),
          );
        } else if (item instanceof File) {
          if (await item.replaceText(pattern, replacer)) {
            result.push(item);
          }
        }
      });

    return this as any;
  }

  toString() {
    return this.map((file) => file.toString()).join('\n');
  }

  print() {
    console.log(this.toString());
  }

  copy() {
    clipboard.text = this.toString();
  }
}

class UnwrappedFileCollection extends GenericItemCollection<File> {
  delete(): ItemCollection {
    this.forEach((f) => f.delete());

    return this;
  }

  updateExt(cb: (ext: string) => string | Promise<string>): ItemCollection {
    this.forEach((f) => (f.ext = awaitSync(cb(f.ext))));

    return this;
  }
}
class UnwrappedDirectoryCollection extends GenericItemCollection<Directory> {}
class UnwrappedItemCollection extends GenericItemCollection<File | Directory> {}

export class FileCollection extends UnwrappedFileCollection {}
export class DirectoryCollection extends UnwrappedDirectoryCollection {}
export class ItemCollection extends UnwrappedItemCollection {}
export type AnyItemCollection =
  | FileCollection
  | DirectoryCollection
  | ItemCollection;

export function files(exp?: string, options: fg.Options = {}): FileCollection {
  return new FileCollection(
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
): DirectoryCollection {
  return new DirectoryCollection(
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

export function glob(exp?: string, options: fg.Options = {}): ItemCollection {
  return new ItemCollection(...files(exp, options), ...dirs(exp, options));
}
