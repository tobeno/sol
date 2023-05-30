import { inspect } from 'util';
import type { MaybeWrapped } from '../interfaces/wrapper.interfaces';
import { log } from '../utils/log.utils';
import { grepFiles } from '../utils/search.utils';
import { unwrap } from '../utils/wrapper.utils';
import { Data } from './data.wrapper';
import { Directory } from './directory.wrapper';
import { File } from './file.wrapper';
import { StorageItem } from './storage-item.wrapper';
import { Text } from './text.wrapper';
import { Wrapper } from './wrapper.wrapper';

/**
 * Base class for storage item collections.
 */
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

  /**
   * Returns all extensions of files in the collection.
   */
  get exts(): string[] {
    return this.files().map((f) => f.exts.join('.')).unique.sorted.value;
  }

  /**
   * Returns all names of files in the collection.
   */
  get names(): string[] {
    return this.map((i) => i.name).sorted.value;
  }

  /**
   * Returns all basenames of files in the collection.
   */
  get basenames(): string[] {
    return this.map((i) => i.basename).sorted.value;
  }

  /**
   * Returns all paths of files in the collection.
   */
  get paths(): string[] {
    return this.map((i) => i.path).sorted.value;
  }

  /**
   * Returns the text content of all files in the collection.
   */
  get text(): Text {
    return Text.create(this.toString());
  }

  /**
   * Returns the items of the collection wrapped as data.
   */
  get data(): Data<ItemType[]> {
    return Data.create(this.value);
  }

  /**
   * Returns all files in the collection.
   */
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

  /**
   * Returns all directories in the collection.
   */
  dirs(): DirectoryCollection {
    let result: Directory[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.push(item);
      }
    });

    return DirectoryCollection.create(result);
  }

  /**
   * Returns all items in the collection.
   */
  items(): StorageItemCollection {
    return this as any;
  }

  /**
   * Returns the item at the specified index.
   */
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

  /**
   * Returns all items matching the given glob pattern.
   */
  glob(exp: string): StorageItemCollection {
    let result: (File | Directory)[] = [];

    this.map((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp));
      }
    });

    return StorageItemCollection.create(result);
  }

  /**
   * Returns all items matching the given (RegExp) pattern.
   */
  grep(pattern: string | RegExp): FileCollection {
    const result: File[] = [];

    this.map((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.grep(pattern));
      } else if (item instanceof File) {
        if (grepFiles(pattern, item.path).length) {
          result.push(item);
        }
      }
    });

    return FileCollection.create(result);
  }

  /**
   * Replaces the given pattern with the replacer in all files in the collection.
   */
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

/**
 * Wrapper for a collection of files.
 */
export class FileCollection extends GenericStorageItemCollection<File> {
  delete(): StorageItemCollection {
    this.forEach((f) => f.delete());

    return this;
  }

  static create(items: MaybeWrapped<File[]>): FileCollection {
    return new FileCollection(unwrap(items));
  }
}

/**
 * Wrapper for a collection of directories.
 */
export class DirectoryCollection extends GenericStorageItemCollection<Directory> {
  static create(items: MaybeWrapped<Directory[]>): DirectoryCollection {
    return new DirectoryCollection(unwrap(items));
  }
}

/**
 * Wrapper for a collection of mixed storage items.
 */
export class StorageItemCollection extends GenericStorageItemCollection<
  File | Directory
> {
  static create(
    items: MaybeWrapped<(File | Directory)[]>,
  ): StorageItemCollection {
    return new StorageItemCollection(unwrap(items));
  }
}

export type AnyStorageItemCollection =
  | FileCollection
  | DirectoryCollection
  | StorageItemCollection;
