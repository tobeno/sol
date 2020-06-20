import * as path from 'path';
import * as fs from 'fs';
import { inspect } from 'util';
import { exec } from 'shelljs';

export abstract class Item {
  absolutePath: string;

  constructor(relativePath: string, public basePath?: string) {
    this.absolutePath = path.resolve(
      basePath ? path.join(basePath, relativePath) : relativePath,
    );
  }

  abstract get name(): string;
  abstract set name(value: string);

  abstract get exists(): boolean;
  abstract set exists(value: boolean);

  abstract moveTo(newPath: string): Item;
  abstract renameTo(newBasename: string): Item;
  abstract create(): Item;

  get path(): string {
    return this.absolutePath;
  }

  set path(value: string) {
    this.absolutePath = path.resolve(value);
  }

  get relativePath(): string {
    return path.relative(process.cwd(), this.path) || '.';
  }

  set relativePath(value: string) {
    this.path = path.resolve(value);
  }

  get basename(): string {
    return path.basename(this.path);
  }

  set basename(value: string) {
    this.renameTo(value);
  }

  get stats() {
    return fs.statSync(this.path);
  }

  get mtime() {
    return this.stats.mtime;
  }

  vscode() {
    exec(`code '${this.path}'`);

    return this;
  }

  toString() {
    return this.path;
  }

  /**
   * Prints just the path when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    const relativePath = this.relativePath;

    return relativePath.includes('../') ? this.path : relativePath;
  }
}
