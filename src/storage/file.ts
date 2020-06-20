import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import { Item } from './item';
import { Directory } from './directory';
import { WithJson } from '../extensions/json';
import { WithPrint } from '../extensions/print';
import { WithCopy } from '../extensions/copy';
import { WithAst } from '../extensions/ast';
import { WithData } from '../extensions/data';
import { WithCsv } from '../extensions/csv';
import { WithText } from '../extensions/text';
import { WithReplaceText } from '../extensions/replace';
import { WithFiles } from '../extensions/files';
import { FileCollection } from './item-collection';

class UnwrappedFile extends Item {
  constructor(path: string) {
    super(path);
  }

  get ext(): string {
    const { basename: name } = this;
    const pos = name.lastIndexOf('.');
    if (pos <= 0) {
      return '';
    }

    return name.slice(pos + 1);
  }

  set ext(ext: string) {
    this.renameTo(`${this.name}.${ext}`);
  }

  get name(): string {
    const { basename: name } = this;
    const pos = name.lastIndexOf('.');
    if (pos <= 0) {
      return name;
    }

    return name.slice(0, pos);
  }

  set name(name: string) {
    this.renameTo(`${name}${this.ext ? `.${this.ext}` : ''}`);
  }

  get dir(): Directory {
    return new Directory(path.dirname(this.path));
  }

  set dir(value: Directory) {
    this.moveTo(`${value.path}/${this.basename}`);
  }

  get text(): string {
    return fs.readFileSync(this.path, 'utf8');
  }

  set text(value: string) {
    fs.writeFileSync(this.path, value, 'utf8');
  }

  get length() {
    return this.text.length;
  }

  get size() {
    return this.stats.size;
  }

  create() {
    if (this.exists) {
      return;
    }

    const dir = this.dir;
    if (!dir.exists) {
      dir.create();
    }

    this.text = '';

    return this;
  }

  files(): FileCollection {
    return new FileCollection(this as any);
  }

  delete() {
    fs.unlinkSync(this.path);
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
    return this.moveTo(`${this.dir.path}/${newBasename}`);
  }

  copyTo(newPath: string) {
    fs.copyFileSync(this.path, newPath);

    return new File(newPath);
  }

  serve() {
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

  pretty() {
    this.text = prettier.format(this.text, {
      filepath: this.path,
    });

    return this;
  }
}

export class File extends WithReplaceText(
  WithFiles(
    WithAst(
      WithCsv(WithJson(WithText(WithData(WithCopy(WithPrint(UnwrappedFile)))))),
    ),
  ),
) {}

export function file(path: string): File {
  return new File(path);
}
