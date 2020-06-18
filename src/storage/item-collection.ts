import { Directory } from './directory';
import { File } from './file';
import { grep } from './fn';
import { clipboard } from '../os/fn';

export class ItemCollection<ItemType extends File | Directory> extends Array<
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

  files(exp?: string): ItemCollection<File> {
    let result: File[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp));
      } else if (!exp && item instanceof File) {
        result.push(item);
      }
    });

    return new ItemCollection<File>(...result);
  }

  dirs(): ItemCollection<Directory> {
    let result: Directory[] = [];

    this.forEach((item) => {
      if (item instanceof Directory) {
        result.push(item);
      }
    });

    return new ItemCollection<Directory>(...result);
  }

  glob(exp: string): ItemCollection<File | Directory> {
    let result: (File | Directory)[] = [];

    this.map((item) => {
      if (item instanceof Directory) {
        result.splice(result.length, 0, ...item.files(exp));
      }
    });

    return new ItemCollection<File | Directory>(...result);
  }

  grep(pattern: string | RegExp): ItemCollection<File> {
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

    return new ItemCollection<File>(...result);
  }

  async replaceText(
    pattern: string | RegExp,
    replacer: any,
  ): Promise<ItemCollection<File>> {
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

    return new ItemCollection<File>(...result);
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
