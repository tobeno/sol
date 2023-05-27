import path from 'path';
import { Directory } from '../wrappers/directory.wrapper';

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
    solPackage = new SolPackage(path.resolve(__dirname, '../..'));
  }

  return solPackage;
}
