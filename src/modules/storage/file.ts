import fs, { mkdirSync } from 'fs';
import path from 'path';
import prettier from 'prettier';
import { StorageItem } from './storage-item';
import { Directory } from './directory';
import { StorageItemCollection } from './storage-item-collection';
import { Text } from '../data/text';
import { log } from '../../utils/log';

export class File<ContentType = any> extends StorageItem {
  constructor(path: string) {
    super(path);
  }

  get cmd(): Text {
    return Text.create(`file(${JSON.stringify(this.path)})`);
  }

  get pathWithoutExt(): string {
    return this.path.slice(0, -1 * (this.ext.length + 1));
  }

  get pathWithoutExts(): string {
    return this.path.slice(0, -1 * (this.exts.join('.').length + 1));
  }

  get basenameWithoutExt(): string {
    return this.basename.slice(0, -1 * (this.ext.length + 1));
  }

  get basenameWithoutExts(): string {
    return this.basename.slice(0, -1 * (this.exts.join('.').length + 1));
  }

  get exts(): string[] {
    const { basename: name } = this;
    const pos = name.indexOf('.');
    if (pos <= 0) {
      return [];
    }

    return name.slice(pos + 1).split('.');
  }

  set exts(exts: string[]) {
    this.renameTo(
      `${this.dir.path}/${this.name}${exts.length ? `.${exts.join('.')}` : ''}`,
    );
  }

  get ext(): string {
    const { exts } = this;
    if (!exts.length) {
      return '';
    }

    return exts[exts.length - 1];
  }

  set ext(value: string) {
    let { exts } = this;

    const newExts = value.split('.');

    exts = [...newExts, ...exts.slice(newExts.length)];

    this.exts = exts;
  }

  get name(): string {
    const { basename: name } = this;
    const pos = name.indexOf('.');
    if (pos <= 0) {
      return name;
    }

    return name.slice(0, pos);
  }

  set name(name: string) {
    const exts = this.exts;

    this.renameTo(
      `${this.dir.path}/${name}${exts.length ? `.${this.exts.join('.')}` : ''}`,
    );
  }

  get dir(): Directory {
    return new Directory(path.dirname(this.path));
  }

  set dir(value: Directory) {
    this.renameTo(`${value.path}/${this.basename}`);
  }

  get exists(): boolean {
    return fs.existsSync(this.path);
  }

  set exists(value: boolean) {
    if (value) {
      this.create();
    } else {
      this.delete();
    }
  }

  get text(): Text | any {
    return Text.create(fs.readFileSync(this.path, 'utf8'));
  }

  set text(value: Text | any) {
    fs.writeFileSync(this.path, value.toString(), 'utf8');
  }

  get length(): number {
    return this.text.length;
  }

  get size(): number {
    return this.stats.size;
  }

  create(): File {
    if (!this.exists) {
      const dir = this.dir;
      if (!dir.exists) {
        dir.create();
      }

      this.text = '';
    }

    return this as any;
  }

  clear(): File {
    this.text = '';

    return this as any;
  }

  items(): StorageItemCollection {
    return new StorageItemCollection(this as any);
  }

  delete(): void {
    fs.unlinkSync(this.path);
  }

  renameTo(newPath: string): this {
    const newDirPath = path.dirname(newPath);
    if (!fs.existsSync(newDirPath)) {
      mkdirSync(newDirPath, {
        recursive: true,
      });
    }

    fs.renameSync(this.path, newPath);

    this.path = newPath;

    return this;
  }

  replaceText(pattern: string | RegExp, replacement: string): this;
  replaceText(
    pattern: string | RegExp,
    replacer: (...matches: string[]) => string,
  ): this;
  replaceText(pattern: string | RegExp, replacer: any): this {
    this.text = this.text.replace(pattern, replacer);

    return this;
  }

  copyTo(newPath: string): File {
    fs.copyFileSync(this.path, newPath);

    return new File(newPath);
  }

  eval<ResultType = any>(): ResultType {
    return eval(this.text.toString());
  }

  serve(): this {
    this.dir.serve();

    return this;
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

  pretty(): this {
    this.text = prettier.format(this.text, {
      filepath: this.path,
    });

    return this;
  }

  print(): void {
    log(String(this));
  }

  static create<ContentType = any>(
    pathOrFile: string | File,
  ): File<ContentType> {
    if (pathOrFile instanceof File) {
      return pathOrFile;
    }

    return new File<ContentType>(pathOrFile);
  }
}
