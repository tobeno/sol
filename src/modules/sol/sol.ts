import { homedir } from 'os';
import { Directory } from '../storage/directory';
import path from 'path';

export class Sol {
  readonly packageDir: Directory;

  constructor(readonly packagePath: string) {
    this.packageDir = Directory.create(packagePath);
  }

  get userDir(): Directory {
    return Directory.create(`${homedir()}/.sol`);
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

  return Directory.create(rootPath);
}
