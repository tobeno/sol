import { dirSync as tmpDirSync } from 'tmp';
import { Directory } from './directory';

export class TmpDirectory {
  static create(): Directory {
    const tmpFile = tmpDirSync();

    return Directory.create(String(tmpFile.name));
  }
}
