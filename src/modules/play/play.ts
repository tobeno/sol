import { File } from '../storage/file';
import { rerequire } from '../../utils/module';
import { Directory } from '../storage/directory';
import { getSolReplServer } from '../sol/sol-repl';
import { log } from '../../utils/log';
import { getCurrentSolWorkspace } from '../sol/sol-workspace';
import { Data } from '../data/data';
import { MaybeWrapped } from '../../interfaces/data';

/**
 * Class for interacting with playground files.
 */
export class PlayFile {
  static instances: Record<string, PlayFile> = {};

  private unwatch: (() => void) | null = null;

  file: File;

  /**
   * Returns the unique ID of the playground file.
   */
  get id(): string {
    return this.file.path;
  }

  constructor(path: string) {
    this.file = File.create(path);
  }

  prepare(): void {
    const workspace = getCurrentSolWorkspace();

    const file = this.file;
    file.create();

    if (!file.size) {
      file.text = `
/* eslint-disable */
// @ts-nocheck

import './${workspace.contextFile.dir.relativePathFrom(file.dir)}/${
        workspace.contextFile.basenameWithoutExt
      }';
    
// ToDo: Add your logic

export default null;
`.trimStart();
    }
  }

  /**
   * Opens the playground file in the default editor.
   */
  edit(): File {
    this.prepare();

    return this.file.edit() as File;
  }

  /**
   * Opens the playground file in the default editor and starts watching for changes.
   */
  play(): this {
    const file = this.file;
    const playId = file.path;

    this.prepare();

    this.edit();

    if (!this.unwatch) {
      let running = false;

      setTimeout(() => {
        let prevText: string | null = null;

        this.unwatch = file.watch((event) => {
          if (event === 'change') {
            let result = undefined;
            try {
              const text = file.text.value;
              if (text === prevText) {
                return;
              }

              prevText = text;

              if (running) {
                return;
              }

              log(`Running play ${playId}...`);

              running = true;
              result = this.replay();
            } finally {
              running = false;
            }

            if (typeof result !== 'undefined') {
              log(result);
              getSolReplServer().displayPrompt();
            }
          } else if (event === 'rename') {
            if (!file.exists) {
              this.unplay();
            }
          }
        });

        log(`Watching ${playId}...`);
      }, 1000);
    }

    return this;
  }

  /**
   * Stops watching for changes in the playground file.
   */
  unplay(): void {
    const playId = this.id;

    if (this.unwatch) {
      this.unwatch();
      this.unwatch = null;

      log(`Stopped watching ${playId}`);
    }
  }

  /**
   * Runs the playground file.
   */
  replay<ResultType = any>(): ResultType {
    const file = this.file;
    if (!file.exists) {
      throw new Error(`No play found for '${file.path}'`);
    }

    let result = rerequire(file.path);

    if (typeof result.default !== 'undefined') {
      result = result.default;
    }

    if (result && typeof result === 'object') {
      if (result.constructor === Object) {
        result = Data.create(result);
      } else if (result.constructor === Array) {
        result = Data.create(result);
      }
    }

    return result;
  }

  static create(pathOrFile: MaybeWrapped<string> | File | null): PlayFile {
    let path: string;
    if (!(pathOrFile instanceof File)) {
      pathOrFile = pathOrFile ? String(pathOrFile) : null;

      path =
        pathOrFile || `play-${new Date().toISOString().replace(/[^0-9]/g, '')}`;

      if (!path.endsWith('.ts')) {
        path += '.ts';
      }

      if (!path.includes('/')) {
        path = getPlayDir().file(path).path;
      }
    } else {
      path = pathOrFile.path;
    }

    if (!this.instances[path]) {
      this.instances[path] = new PlayFile(path);
    }

    return this.instances[path];
  }
}

export function getPlayDir(): Directory {
  return getCurrentSolWorkspace().dir.dir('play');
}

/**
 * Loads the given file as playground file.
 */
export function playFile(pathOrFile: string | File | null = null): PlayFile {
  return PlayFile.create(pathOrFile);
}

/**
 * Opens the file in the default editor and watches for changes.
 */
export function play(pathOrFile: string | File | null = null): PlayFile {
  const f = playFile(pathOrFile);

  f.play();

  return f;
}

/**
 * Returns available playground files.
 */
export function getPlays(): PlayFile[] {
  return [...getPlayDir().files()].map((file) => playFile(file.path));
}

/**
 * Stops watching for changes in the given playground file.
 */
export function unplay(pathOrFile: string | File | null = null): void {
  if (pathOrFile) {
    const f = playFile(pathOrFile);

    f.unplay();
  } else {
    Object.values(PlayFile.instances).forEach((f) => {
      f.unplay();
    });
    PlayFile.instances = {};
  }
}

/**
 * Runs the given playground file.
 */
export function replay<ResultType = any>(
  pathOrFile: string | File,
): ResultType {
  const f = playFile(pathOrFile);

  return f.replay();
}
