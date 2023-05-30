import { Wrapper } from './wrapper.wrapper';
import { Directory } from './directory.wrapper';
import { Text } from './text.wrapper';
import { Data } from './data.wrapper';
import { isArray, isBoolean, isNotEmpty } from '../utils/core.utils';
import { inspect } from 'util';
import { execCommand } from '../utils/shell.utils';

export interface ShellGrepOptions {
  /**
   * Case insensitive (default: false)
   */
  insensitive?: boolean;
  /**
   * Just list files (default: false)
   */
  list?: boolean;
  /**
   * Sort results (default: true)
   */
  sort?: boolean;
}

export interface ShellRmOptions {
  recursive?: boolean;
}

export interface ShellCpOptions {
  recursive?: boolean;
}

export interface ShellLsOptions {
  list?: boolean;
  all?: boolean;
}

export interface ShellHeadOptions {
  lines?: number;
}

export interface ShellTailOptions {
  lines?: number;
}

export class Shell extends Wrapper<Directory> {
  cat(files: string | string[]): Text {
    return this.exec(`cat ${this.createShellPaths(files)}`);
  }

  exec(command: string): Text {
    return execCommand(command, {
      cwd: this.value.path,
    });
  }

  chmod(mode: string | number, paths: string | string[]): void {
    this.exec(`chmod ${mode} ${this.createShellPaths(paths)}`);
  }

  mkdir(path: string): void {
    this.exec(`mkdir -p '${path}'`);
  }

  rm(paths: string | string[], options: ShellRmOptions = {}): void {
    this.exec(
      `rm ${this.createShellOptions({
        R: options.recursive,
      })} ${this.createShellPaths(paths)}`,
    );
  }

  touch(paths: string | string[]): void {
    this.exec(`touch ${this.createShellPaths(paths)}`);
  }

  which(command: string): void {
    this.exec(`which ${command}`);
  }

  cd(path: string): void {
    this.exec(`cd ${this.createShellPaths(path)}`);
  }

  mv(fromPath: string, toPath: string): void {
    this.exec(
      `mv ${this.createShellPaths(fromPath)} ${this.createShellPaths(toPath)}`,
    );
  }

  cp(fromPath: string, toPath: string, options: ShellCpOptions = {}): void {
    this.exec(
      `cp ${this.createShellOptions({
        R: options.recursive,
      })} ${this.createShellPaths(fromPath)} ${this.createShellPaths(toPath)}`,
    );
  }

  ln(fromPath: string, toPath: string): void {
    this.exec(
      `ln -s ${this.createShellPaths(fromPath)} ${this.createShellPaths(
        toPath,
      )}`,
    );
  }

  grep(pattern: string | RegExp, options?: ShellGrepOptions): Data<Text[]>;
  grep(
    pattern: string | RegExp,
    paths?: string | string[],
    options?: ShellGrepOptions,
  ): Data<Text[]>;
  grep(pattern: string | RegExp, ...args: any[]): Data<Text[]> {
    let paths: string | string[];
    let options: ShellGrepOptions;
    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      paths = args[0];
      options = args[1] || {};
    } else {
      paths = [];
      options = args[0] || {};
    }

    if (pattern instanceof RegExp) {
      if (pattern.flags.includes('i')) {
        options.insensitive = true;
      }
      pattern = pattern.source;
    }

    const output = this.exec(
      `rg ${this.createShellOptions({
        l: options.list,
        i: options.insensitive,
        'sort-files': options.sort ?? true,
      })} -e  '${pattern.replace(/'/g, "\\'").replace('\n', '\\n')}' ${
        this.createShellPaths(paths) || '.'
      }`,
    );

    return output.lines;
  }

  ls(options?: ShellLsOptions): Data<Text[]>;
  ls(paths: string | string[], options?: ShellLsOptions): Data<Text[]>;
  ls(...args: any[]): Data<Text[]> {
    let options: ShellLsOptions;
    let paths: string | string[];
    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      paths = args[0];
      options = args[1] || {};
    } else {
      paths = [];
      options = args[0] || {};
    }

    const output = this.exec(
      `ls ${this.createShellOptions({
        a: options.all,
        l: options.list,
      })} ${this.createShellPaths(paths)}`,
    );

    return output.lines.filter(
      (line) =>
        !line.endsWith('~') &&
        !line.endsWith(' .') &&
        !line.endsWith(' ..') &&
        !line.startsWith('total '),
    );
  }

  head(path: string, options: ShellHeadOptions = {}): Text {
    return this.exec(
      `head ${this.createShellOptions({
        n: options.lines,
      })} ${path}`,
    );
  }

  tail(path: string, options: ShellTailOptions = {}): Text {
    return this.exec(
      `tail ${this.createShellOptions({
        n: options.lines,
      })} ${path}`,
    );
  }

  private createShellPaths(paths: string | string[]): string {
    if (!Array.isArray(paths)) {
      paths = [paths];
    }

    return paths
      .map((path) => (path.includes(' ') ? `'${path}'` : path))
      .join(' ');
  }

  private createShellOptions(
    optionsMap: Record<string, boolean | number | string | undefined>,
  ): string {
    const options = Object.keys(optionsMap)
      .filter((key) => isNotEmpty(optionsMap[key]))
      .map((key) => {
        const value = optionsMap[key];
        const prefix = key.length === 1 ? '-' : '--';
        if (!isBoolean(value)) {
          if (isArray(value)) {
            return value
              .map((childValue) => `${prefix}${key} ${childValue}`)
              .join(' ');
          }

          return `${prefix}${key} ${value}`;
        }

        return `${prefix}${key}`;
      });

    return options.join(' ');
  }

  /**
   * Prints just the path when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    const relativePath = this.value.relativePath;

    return `${this.constructor.name} { ${
      relativePath.includes('../') ? this.value.path : relativePath
    } }`;
  }

  static create(directory: Directory | string | null = null) {
    directory = directory || process.cwd();

    return new Shell(Directory.create(directory));
  }
}
