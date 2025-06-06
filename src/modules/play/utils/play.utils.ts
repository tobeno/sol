import type { MaybeWrapped } from '../../../interfaces/wrapper.interfaces';
import { getSolReplServer } from '../../../sol/sol-repl';
import { getCurrentSolWorkspace } from '../../../sol/sol-workspace';
import { log } from '../../../utils/log.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { Directory } from '../../../wrappers/directory.wrapper';
import { File } from '../../../wrappers/file.wrapper';

/**
 * Class for interacting with playground files.
 */
export class PlayFile {
  static instances: Record<string, PlayFile> = {};
  static usageHelp = `
> playFile('test').play()
> playFile('test').replay()
> playFile('test').edit()
  `.trim();

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
   
export async function main() { 
  // ToDo: Add your logic
  return null;
}
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

        this.unwatch = file.watch(async (event) => {
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
              result = await this.replay();
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
  async replay<ResultType = any>(): Promise<ResultType> {
    const file = this.file;
    if (!file.exists) {
      throw new Error(`No play found for '${file.path}'`);
    }

    let result = await file.reimport();
    if (typeof result.main !== 'undefined') {
      result = await result.main();
    } else if (typeof result.default !== 'undefined') {
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
      this.instances[path] = withHelp(
        new PlayFile(path),
        `
A play file.

Usage:
${PlayFile.usageHelp}
      `,
      );
    }

    return this.instances[path]!;
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
export function getPlays(): Data<PlayFile[]> {
  return Data.create(
    [...getPlayDir().files()].map((file) => playFile(file.path)),
  );
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
export async function replay<ResultType = any>(
  pathOrFile: string | File,
): Promise<ResultType> {
  const f = playFile(pathOrFile);

  return f.replay();
}
