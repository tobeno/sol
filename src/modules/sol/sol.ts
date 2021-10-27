import { homedir } from 'os';
import { dir, Directory } from '../storage/directory';
import path from 'path';

export class Sol {
  readonly packageDir: Directory;

  constructor(readonly packagePath: string) {
    this.packageDir = dir(packagePath);
  }

  get packageDistDir(): Directory {
    return this.packageDir.dir('dist/src');
  }

  get userDir(): Directory {
    return dir(`${homedir()}/.sol`);
  }
}

let sol: Sol | null = null;

export function getSol(): Sol {
  if (!sol) {
    sol = new Sol(getSolPackageDir().path);
  }

  return sol;
}

export function getSolPackageDir(): Directory {
  let rootPath = path.resolve(__dirname, '../../..');

  if (path.basename(rootPath) === 'dist') {
    rootPath = path.dirname(rootPath);
  }

  return dir(rootPath);
}
