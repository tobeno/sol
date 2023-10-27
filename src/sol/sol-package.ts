import path from 'path';
import { Directory } from '../wrappers/directory.wrapper';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
