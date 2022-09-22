import { File } from '../storage/file';
import { rerequire } from '../../utils/module';
import { Directory } from '../storage/directory';
import { getSolReplServer } from '../sol/sol-repl';
import { log } from '../../utils/log';
import {
  getCurrentSolWorkspace,
  getCurrentSolWorkspaceDir,
} from '../sol/sol-workspace';
import { Data } from '../data/data';

export class PlayFile {
  static instances: Record<string, PlayFile> = {};

  private unwatch: (() => void) | null = null;

  file: File;

  get id(): string {
    return this.file.path;
  }

  constructor(path: string) {
    this.file = new File(path);
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

  edit(): File {
    return this.file.edit() as File;
  }

  play(): void {
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
  }

  unplay(): void {
    const playId = this.id;

    if (this.unwatch) {
      this.unwatch();
      this.unwatch = null;

      log(`Stopped watching ${playId}`);
    }
  }

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

  static create(pathOrFile: string | File | null): PlayFile {
    let path: string;
    if (!(pathOrFile instanceof File)) {
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
  return getCurrentSolWorkspaceDir().dir('play');
}

export function playFile(pathOrFile: string | File | null = null): PlayFile {
  return PlayFile.create(pathOrFile);
}

export function play(pathOrFile: string | File | null = null): PlayFile {
  const f = playFile(pathOrFile);

  f.play();

  return f;
}

export function listPlays(): Record<string, PlayFile> {
  return [...getPlayDir().files()].reduce(
    (result: Record<string, PlayFile>, file) => {
      result[file.basenameWithoutExt] = playFile(file.path);

      return result;
    },
    {},
  );
}

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

export function replay<ResultType = any>(
  pathOrFile: string | File,
): ResultType {
  const f = playFile(pathOrFile);

  return f.replay();
}
