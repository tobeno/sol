import { Directory } from './directory';
import { File } from './file';
import { grep } from './search';
import { clipboard } from '../os/clipboard';
import { WithFiles } from '../extensions/files';
import { Item } from './item';
import * as fg from 'fast-glob';

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

  async replaceText(
    pattern: string | RegExp,
    replacer: any,
  ): Promise<FileCollection> {
    const result: File[] = [];

    await Promise.all(
      this.map(async (item) => {
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
      }),
    );

    return new FileCollection(...result);
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

class UnwrappedFileCollection extends GenericItemCollection<File> {}
class UnwrappedDirectoryCollection extends GenericItemCollection<Directory> {}
class UnwrappedItemCollection extends GenericItemCollection<File | Directory> {}

export class FileCollection extends WithFiles(UnwrappedFileCollection) {}
export class DirectoryCollection extends WithFiles(
  UnwrappedDirectoryCollection,
) {}
export class ItemCollection extends WithFiles(UnwrappedItemCollection) {}

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
