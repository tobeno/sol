import { Directory } from '../storage/directory';
import path from 'path';

/**
 * Class for working with the Sol package / library.
 */
export class SolPackage {
  readonly dir: Directory;

  constructor(packagePath: string) {
    this.dir = Directory.create(packagePath);
  }
}

let solPackage: SolPackage | null = null;

/**
 * Returns the Sol package / library.
 */
export function getSolPackage(): SolPackage {
  if (!solPackage) {
    solPackage = new SolPackage(path.resolve(__dirname, '../../..'));
  }

  return solPackage;
}
