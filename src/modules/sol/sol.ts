import { homedir } from 'os';
import { dir, Directory } from '../storage/directory';
import { getSolPath } from '../utils/env';

export class Sol {
  get packageDir(): Directory {
    return dir(getSolPath());
  }

  get packageDistDir(): Directory {
    return this.packageDir.dir('dist/src');
  }

  get userDir(): Directory {
    return dir(`${homedir()}/.sol`);
  }
}

export const sol = new Sol();
