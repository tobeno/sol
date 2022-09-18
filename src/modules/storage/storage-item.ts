import path from 'path';
import fs from 'fs';
import { inspect } from 'util';
import * as os from 'os';

export abstract class StorageItem {
  absolutePath: string;

  constructor(relativePath: string, public basePath?: string) {
    // Resolve home directory references
    if (relativePath.startsWith('~/')) {
      relativePath = path.join(os.homedir(), relativePath.substr(2));
    }

    this.absolutePath = path.resolve(
      basePath ? path.join(basePath, relativePath) : relativePath,
    );
  }

  abstract get name(): string;
  abstract set name(value: string);

  abstract get exists(): boolean;
  abstract set exists(value: boolean);

  abstract renameTo(newPath: string): StorageItem;

  abstract create(): StorageItem;

  get path(): string {
    return this.absolutePath;
  }

  set path(value: string) {
    this.absolutePath = path.resolve(value);
  }

  get uri(): string {
    return 'file://' + this.path;
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

  get stats(): fs.Stats {
    return fs.statSync(this.path);
  }

  get mtime(): Date {
    return this.stats.mtime;
  }

  toString(): string {
    return this.path;
  }

  /**
   * Prints just the path when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    const relativePath = this.relativePath;

    return relativePath.includes('../') ? this.path : relativePath;
  }
}
