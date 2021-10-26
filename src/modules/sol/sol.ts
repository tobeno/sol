import { homedir } from 'os';
import { dir, Directory } from '../storage/directory';
import { File } from '../storage/file';
import { Workspace } from './workspace';
import { getCwd, getSolPath } from '../utils/env';
import { logDebug } from '../utils/log';

export class Sol {
  workspace: Workspace;
  userWorkspace: Workspace;
  loaded = false;

  constructor() {
    this.workspace = new Workspace(
      `${getCwd()}/.sol`,
      this.packageDistDir.path,
    );
    this.userWorkspace = new Workspace(
      this.userDir.path,
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

  get userSetupFile(): File {
    return this.userDir.file('setup.ts');
  }

  load(): void {
    if (this.loaded) {
      return;
    }

    logDebug('Loading Sol instance...');

    this.userWorkspace.load();
    this.workspace.load();

    // Update context files again
    this.userWorkspace.updateContextFile();
    this.workspace.updateContextFile();

    logDebug('Loaded Sol instance');

    this.loaded = true;
  }
}

export const sol = new Sol();
