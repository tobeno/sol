import { homedir } from 'os';
import { dir, Directory } from '../storage/directory';
import path from 'path';

export class Sol {
  readonly packageDir: Directory;

  constructor(readonly packagePath: string) {
    this.packageDir = dir(packagePath);
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
  const rootPath = path.resolve(__dirname, '../../..');

  return dir(rootPath);
}
