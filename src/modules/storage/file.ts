import fs, { mkdirSync } from 'fs';
import path from 'path';
import { StorageItem } from './storage-item';
import { Directory } from './directory';
import { StorageItemCollection } from './storage-item-collection';
import { Text } from '../data/text';
import { log } from '../../utils/log';

/**
 * Wrapper for a file.
 */
export class File extends StorageItem {
  constructor(path: string | Text) {
    super(path);
  }

  /**
   * Returns the command to wrap this file.
   */
  get cmd(): Text {
    return Text.create(`file(${JSON.stringify(this.path)})`);
  }

  /**
   * Returns the path of the file without the extension.
   */
  get pathWithoutExt(): string {
    return this.path.slice(0, -1 * (this.ext.length + 1));
  }

  /**
   * Returns the path of the file without all extensions.
   */
  get pathWithoutExts(): string {
    return this.path.slice(0, -1 * (this.exts.join('.').length + 1));
  }

  /**
   * Returns the name of the file without the extension.
   */
  get basenameWithoutExt(): string {
    return this.basename.slice(0, -1 * (this.ext.length + 1));
  }

  /**
   * Returns the name of the file without all extensions.
   */
  get basenameWithoutExts(): string {
    return this.basename.slice(0, -1 * (this.exts.join('.').length + 1));
  }

  /**
   * Returns all extensions of the file.
   */
  get exts(): string[] {
    const { basename: name } = this;
    const pos = name.indexOf('.');
    if (pos <= 0) {
      return [];
    }

    return name.slice(pos + 1).split('.');
  }

  /**
   * Sets all extensions of the file.
   */
  set exts(exts: string[]) {
    this.renameTo(
      `${this.dir.path}/${this.name}${exts.length ? `.${exts.join('.')}` : ''}`,
    );
  }

  /**
   * Returns the extension of the file:
   */
  get ext(): string {
    const { exts } = this;
    if (!exts.length) {
      return '';
    }

    return exts[exts.length - 1];
  }

  /**
   * Sets the extension of the file.
   */
  set ext(value: string) {
    let { exts } = this;

    const newExts = value.split('.');

    exts = [...newExts, ...exts.slice(newExts.length)];

    this.exts = exts;
  }

  /**
   * Returns the name of the file (without extensions).
   */
  get name(): string {
    const { basename: name } = this;
    const pos = name.indexOf('.');
    if (pos <= 0) {
      return name;
    }

    return name.slice(0, pos);
  }

  /**
   * Sets the name of the file (without extensions).
   */
  set name(name: string) {
    const exts = this.exts;

    this.renameTo(
      `${this.dir.path}/${name}${exts.length ? `.${this.exts.join('.')}` : ''}`,
    );
  }

  /**
   * Returns the directory of the file.
   */
  get dir(): Directory {
    return Directory.create(path.dirname(this.path));
  }

  /**
   * Sets the directory of the file (moving it to the new location).
   */
  set dir(value: Directory) {
    this.renameTo(`${value.path}/${this.basename}`);
  }

  /**
   * Returns true of the file exists.
   */
  get exists(): boolean {
    return fs.existsSync(this.path);
  }

  /**
   * Set to true to ensure the file exists (create if needed), set to false to ensure it does not exist (delete if needed).
   */
  set exists(value: boolean) {
    if (value) {
      this.create();
    } else {
      this.delete();
    }
  }

  /**
   * Returns the text contents of the file.
   */
  get text(): Text {
    return Text.create(fs.readFileSync(this.path, 'utf8'));
  }

  /**
   * Sets the text contents of the file.
   */
  set text(value: Text | string) {
    fs.writeFileSync(this.path, value.toString(), 'utf8');
  }

  /**
   * Returns the length of the file.
   */
  get length(): number {
    return this.text.length;
  }

  /**
   * Returns the size of the file in bytes.
   */
  get size(): number {
    return this.stats.size;
  }

  /**
   * Creates the file if it does not exist.
   */
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

  /**
   * Empties the file.
   */
  clear(): File {
    this.text = '';

    return this as any;
  }

  items(): StorageItemCollection {
    return StorageItemCollection.create(this as any);
  }

  /**
   * Deletes the file.
   */
  delete(): void {
    fs.unlinkSync(this.path);
  }

  /**
   * Renames / moves the file to the given path. Missing directories will be created.
   */
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

  /**
   * Replaces the given pattern with the replacement in the file.
   */
  replaceText(pattern: string | RegExp, replacement: string): this;
  /**
   * Replaces the given pattern with the replacer in the file.
   */
  replaceText(
    pattern: string | RegExp,
    replacer: (...matches: string[]) => string,
  ): this;
  replaceText(pattern: any, replacer: any): this {
    this.text = this.text.replace(pattern, replacer);

    return this;
  }

  /**
   * Copies the file to the given path.
   */
  copyTo(newPath: string): File {
    fs.copyFileSync(this.path, newPath);

    return File.create(newPath);
  }

  /**
   * Serves the file over HTTP.
   */
  serve(): this {
    this.dir.serve();

    return this;
  }

  /**
   * Watches the file for changes.
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
   * Prettifies the file.
   */
  pretty(): this {
    const prettier = require('prettier');

    this.text = Text.create(
      prettier.format(this.text.value, {
        filepath: this.path,
      }),
    );

    return this;
  }

  /**
   * Prints the contents of the file to the console.
   */
  print(): void {
    log(String(this));
  }

  static create(pathOrFile: string | File): File {
    if (pathOrFile instanceof File) {
      return pathOrFile;
    }

    return new File(pathOrFile);
  }
}
