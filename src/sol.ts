import { homedir } from 'os';
import { REPLServer } from 'repl';
import { Directory, dir } from './storage/directory';
import { File } from './storage/file';

export class Sol {
  server: REPLServer | null = null;

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

    return localDir;
  }

  get playDir(): Directory {
    const playDir = this.localDir.dir('play');
    playDir.create();

    return playDir;
  }

  clearHistory() {
    if (!this.server) {
      return;
    }

    (this.server as any).history = [];
    this.historyFile.clear();
  }
}

export const sol = new Sol();
