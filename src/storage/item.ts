import * as path from 'path';
import * as fs from 'fs';
import { inspect } from 'util';
import { exec } from 'shelljs';

export abstract class Item {
  path: string;

  constructor(public relativePath: string, public basePath?: string) {
    this.path = basePath ? path.join(basePath, relativePath) : relativePath;
  }

  abstract get name(): string;
  abstract set name(value: string);

  abstract moveTo(newPath: string): Item;
  abstract renameTo(newBasename: string): Item;

  get basename(): string {
    return path.basename(this.path);
  }

  set basename(value: string) {
    this.renameTo(value);
  }

  get exists(): boolean {
    return fs.existsSync(this.path);
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
    return this.path;
  }
}
