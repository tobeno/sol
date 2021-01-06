import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import { Item } from './item';
import { Directory } from './directory';
import { ItemCollection } from './item-collection';
import { play, replay, setupPlay, unwatchPlay } from '../play';
import {
  jsonToData,
  yamlToData,
  csvToData,
  wrapString,
  dataToJson,
  dataToYaml,
  dataToCsv,
  codeToAst,
  astToCode,
} from '../data/transformer';
import { Text } from '../data/text';
import { Data } from '../data/data';
import { Ast } from '../data/ast';
import { clipboard } from '../os/clipboard';

export class File<ContentType = any> extends Item {
  constructor(path: string) {
    super(path);
  }

  get cmd() {
    return wrapString(`file(${JSON.stringify(this.path)})`);
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

  set exts(ext: string[]) {
    this.renameTo(ext.join('.'));
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

    this.renameTo(`${name}${exts.length ? `.${this.exts.join('.')}` : ''}`);
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

  get text(): Text | any {
    return wrapString(fs.readFileSync(this.path, 'utf8'), null, this);
  }

  set text(value: Text | any) {
    fs.writeFileSync(this.path, value.toString(), 'utf8');
  }

  get json(): Data<ContentType> {
    return jsonToData(this.text);
  }

  set json(value: Data<ContentType>) {
    this.text = dataToJson(value);
  }

  get yaml(): Data<ContentType> {
    return yamlToData(this.text);
  }

  set yaml(value: Data<ContentType>) {
    this.text = dataToYaml(value);
  }

  get csv(): Data<ContentType> {
    return csvToData(this.text, this);
  }

  set csv(value: Data<ContentType>) {
    this.text = dataToCsv(value);
  }

  get ast(): Ast {
    return codeToAst(this.text);
  }

  set ast(value: Ast) {
    this.text = astToCode(value);
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

  delete(): void {
    fs.unlinkSync(this.path);
  }

  moveTo(newPath: string | Directory): this {
    if (newPath instanceof Directory) {
      newPath = `${newPath.path}/${this.basename}`;
    }

    fs.renameSync(this.path, newPath);

    this.path = newPath;

    return this;
  }

  renameTo(newBasename: string): this {
    return this.moveTo(`${this.dir.path}/${newBasename}`);
  }

  replaceText(pattern: string | RegExp, replacer: any): this {
    this.text = this.text.replace(pattern, replacer);

    return this;
  }

  copyTo(newPath: string): File {
    fs.copyFileSync(this.path, newPath);

    return new File(newPath);
  }

  eval(): any {
    return eval(this.text.toString());
  }

  play(): File {
    return play(this.path);
  }

  setupPlay(): void {
    setupPlay(this.path);
  }

  replay(): any {
    return replay(this.path);
  }

  unwatchPlay(): void {
    unwatchPlay(this.path);
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

  copy() {
    clipboard.text = String(this);
  }

  print() {
    console.log(String(this));
  }
}

// export class File extends WithCopy(WithPrint(File)) {}

export function file<ContentType = any>(path: string): File<ContentType> {
  return new File<ContentType>(path);
}
