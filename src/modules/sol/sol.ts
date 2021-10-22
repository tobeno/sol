import { homedir } from 'os';
import { dir, Directory } from '../storage/directory';
import { Workspace } from './workspace';
import { getCwd, getSolPath } from '../utils/env';

export class Sol {
  workspace: Workspace;
  loaded = false;

  constructor() {
    this.workspace = new Workspace(
      `${getCwd()}/.sol`,
      this.packageDistDir.path,
    );
  }

  get packageDir(): Directory {
    return dir(getSolPath());
  }

  get packageDistDir(): Directory {
    return this.packageDir.dir('dist/src');
  }

  get userDir(): Directory {
    return dir(`${homedir()}/.sol`);
  }

  load(): void {
    if (this.loaded) {
      return;
    }

    this.workspace.load();

    this.loaded = true;
  }
}

export const sol = new Sol();
