import * as path from 'path';
import * as fs from 'fs';
import { inspect } from 'util';
import { exec } from 'shelljs';

export abstract class Item {
  path: string;

  constructor(public relativePath: string, public basePath?: string) {
    this.path = basePath ? path.join(basePath, relativePath) : relativePath;
  }

  get basename(): string {
    return path.basename(this.path);
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
