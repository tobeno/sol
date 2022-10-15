import { Directory } from './directory';
import { File } from './file';
import { grep } from './search';
import { StorageItem } from './storage-item';
import type fg from 'fast-glob';
import { Data } from '../data/data';
import { Text } from '../data/text';
import { log } from '../../utils/log';
import { Wrapper } from '../data/wrapper';
import { inspect } from 'util';

export class GenericStorageItemCollection<
  ItemType extends StorageItem,
> extends Wrapper<ItemType[]> {
  get size(): number {
    let result = 0;

    this.value.forEach((item) => {
      if (item instanceof Directory || item instanceof File) {
        result += item.size;
      }
    });

    return result;
  }

  get exts(): Data<string[]> {
    return this.files().map((f) => f.exts.join('.')).unique.sorted;
  }

  get names(): Data<string[]> {
    return this.map((i) => i.name).sorted;
  }

  get basenames(): Data<string[]> {
    return this.map((i) => i.basename).sorted;
  }

  get paths(): Data<string[]> {
    return this.map((i) => i.path).sorted;
  }

  get text(): Text {
    return Text.create(this.toString());
  }

  files(exp?: string): FileCollection {
    let result: File[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp).value);
      } else if (!exp && item instanceof File) {
        result.push(item);
      }
    });

    return FileCollection.create(result);
  }

  dirs(): DirectoryCollection {
    let result: Directory[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.push(item);
      }
    });

    return DirectoryCollection.create(result);
  }

  items(): StorageItemCollection {
    return this as any;
  }

  get(index: number): StorageItem {
    return this.value[index];
  }

  forEach(cb: (item: ItemType) => void): void {
    this.value.forEach(cb);
  }

  map<ResultItemType>(
    cb: (item: ItemType) => ResultItemType,
  ): Data<ResultItemType[]> {
    return Data.create(this.value.map(cb));
  }

  glob(exp: string): StorageItemCollection {
    let result: (File | Directory)[] = [];

    this.map((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp));
      }
    });

    return StorageItemCollection.create(result);
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

    return FileCollection.create(result);
  }

  updateName(cb: (name: string) => string): this {
    this.forEach((f) => (f.name = cb(f.name)));

    return this;
  }

  updateBasename(cb: (basename: string) => string): this {
    this.forEach((f) => (f.basename = cb(f.basename)));

    return this;
  }

  replaceText(pattern: string | RegExp, replacer: any): this {
    this.forEach(async (item) => {
      if (item instanceof Directory) {
        item.items().replaceText(pattern, replacer);
      } else if (item instanceof File) {
        item.replaceText(pattern, replacer);
      }
    });

    return this;
  }

  toString(): string {
    return this.map((file) => file.toString()).join('\n').value;
  }

  print(): void {
    log(this.toString());
  }

  get length(): number {
    return this.value.length;
  }

  [Symbol.iterator]() {
    return this.value[Symbol.iterator]();
  }

  [inspect.custom](): string {
    return `${this.constructor.name} ${inspect(this.value)}`;
  }
}

export class FileCollection extends GenericStorageItemCollection<File> {
  delete(): StorageItemCollection {
    this.forEach((f) => f.delete());

    return this;
  }

  updateExt(cb: (ext: string) => string): StorageItemCollection {
    this.forEach((f) => (f.ext = cb(f.ext)));

    return this;
  }

  updateExts(cb: (exts: string[]) => string[]): StorageItemCollection {
    this.forEach((f) => (f.exts = cb(f.exts)));

    return this;
  }

  static create(items: File[]): FileCollection {
    return new FileCollection(items);
  }
}

export class DirectoryCollection extends GenericStorageItemCollection<Directory> {
  static create(items: Directory[]): DirectoryCollection {
    return new DirectoryCollection(items);
  }
}

export class StorageItemCollection extends GenericStorageItemCollection<
  File | Directory
> {
  static create(items: (File | Directory)[]): StorageItemCollection {
    return new StorageItemCollection(items);
  }
}

export type AnyStorageItemCollection =
  | FileCollection
  | DirectoryCollection
  | StorageItemCollection;

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

export function glob(
  exp?: string,
  options: fg.Options = {},
): StorageItemCollection {
  return StorageItemCollection.create([
    ...files(exp, options).value,
    ...dirs(exp, options).value,
  ]);
}
