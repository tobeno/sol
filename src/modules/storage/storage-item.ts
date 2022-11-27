import path from 'path';
import fs from 'fs';
import { inspect } from 'util';
import * as os from 'os';

/**
 * Base class for all storage items.
 */
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

  /**
   * Returns the path of the item.
   */
  get path(): string {
    return this.absolutePath;
  }

  /**
   * Sets the path of the item (does NOT move it).
   */
  set path(value: string) {
    this.absolutePath = path.resolve(value);
  }

  /**
   * Returns the URI of the item.
   */
  get uri(): string {
    return 'file://' + this.path;
  }

  /**
   * Returns the path of the item relative to the current working directory.
   */
  get relativePath(): string {
    return path.relative(process.cwd(), this.path) || '.';
  }

  /**
   * Sets the path relative to the current working directory (does NOT move it).
   */
  set relativePath(value: string) {
    this.path = path.resolve(value);
  }

  /**
   * Returns the basename of the item.
   */
  get basename(): string {
    return path.basename(this.path);
  }

  /**
   * Sets the basename of the item.
   */
  set basename(value: string) {
    this.renameTo(value);
  }

  /**
   * Returns stats about the item.
   */
  get stats(): fs.Stats {
    return fs.statSync(this.path);
  }

  /**
   * Returns the last modified date of the item.
   */
  get mtime(): Date {
    return this.stats.mtime;
  }

  /**
   * Stores the item in a variable with the given name.
   */
  as(name: string): this {
    (global as any)[name] = this;

    return this;
  }

  toString(): string {
    return this.path;
  }

  /**
   * Prints just the path when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    const relativePath = this.relativePath;

    return `${this.constructor.name} { ${
      relativePath.includes('../') ? this.path : relativePath
    } }`;
  }
}
