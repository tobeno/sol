import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import { Item } from './item';
import { Directory } from './directory';
import { WithJson } from '../wrappers/with-json';
import { WithPrint } from '../wrappers/with-print';
import { WithCopy } from '../wrappers/with-copy';
import { WithAst } from '../wrappers/with-ast';
import { WithData } from '../wrappers/with-data';
import { WithCsv } from '../wrappers/with-csv';
import { WithText } from '../wrappers/with-text';
import { WithReplaceText } from '../wrappers/with-replace-text';
import { ItemCollection } from './item-collection';
import { play, replay, setupPlay, unwatchPlay } from '../integrations/vscode';

class UnwrappedFile extends Item {
  constructor(path: string) {
    super(path);
  }

  get pathWithoutExt(): string {
    return this.path.slice(0, -1 * (this.ext.length + 1));
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

  items(): ItemCollection {
    return new ItemCollection(this as any);
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

  play() {
    play(this.path);
  }

  setupPlay(noLocalGlobals = false) {
    setupPlay(this.path, noLocalGlobals);
  }

  replay() {
    replay(this.path);
  }

  unwatchPlay() {
    unwatchPlay(this.path);
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

class CoreFile extends WithText(WithData(UnwrappedFile)) {}
class DataFile extends WithAst(WithCsv(WithJson(CoreFile))) {}
class ToolsFile extends WithReplaceText(WithCopy(WithPrint(DataFile))) {}

export class File extends ToolsFile {}

export function file(path: string): File {
  return new File(path);
}
