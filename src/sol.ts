import { homedir } from 'os';
import { REPLServer } from 'repl';
import { Directory, dir } from './storage/directory';
import { File, file } from './storage/file';

export class Sol {
  server: REPLServer | null = null;
  globals = {};
  localGlobals = {};

  get packageDir(): Directory {
    return this.runtimeDir.parent;
  }

  get packageSrcDir(): Directory {
    return this.packageDir.dir('src');
  }

  get runtimeDir(): Directory {
    return dir(__dirname);
  }

  get globalDir(): Directory {
    const globalDir = dir(`${homedir()}/.sol`);
    globalDir.create();

    return globalDir;
  }

  get historyFile(): File {
    const historyFile = this.globalDir.file('history');
    historyFile.create();

    return historyFile;
  }

  get localDir(): Directory {
    const localDir = dir('.sol');
    localDir.create();

    const gitignoreFile = localDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    return localDir;
  }

  get playDir(): Directory {
    const playDir = this.localDir.dir('play');
    playDir.create();

    return playDir;
  }

  get localGlobalsFile(): File {
    const setupFile = this.localDir.file('globals.ts');

    if (!setupFile.exists) {
      setupFile.create();
      setupFile.text =
        'export const localGlobals = {};\n\nsol.registerLocalGlobals(localGlobals);\n';
    }

    setupFile.setupPlay(true);

    return setupFile;
  }

  playFile(path?: string): File {
    path = path || `play-${new Date().toISOString().replace(/[^0-9]/g, '')}`;

    if (!path.endsWith('.ts')) {
      path += '.ts';
    }

    let playFile;
    if (!path.includes('/')) {
      playFile = this.playDir.file(path);
    } else {
      playFile = file(path);
    }

    return playFile;
  }

  clearHistory() {
    if (!this.server) {
      return;
    }

    (this.server as any).history = [];
    this.historyFile.clear();
  }

  registerGlobals(globals: any) {
    const globalGeneric = global as any;

    Object.assign(globalGeneric, globals);
    Object.assign(this.globals, globals);
  }

  registerLocalGlobals(globals: any) {
    const globalGeneric = global as any;

    Object.assign(globalGeneric, globals);
    Object.assign(this.localGlobals, globals);
  }
}

export const sol = new Sol();
