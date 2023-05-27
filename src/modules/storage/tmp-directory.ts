import { Directory } from './directory';

export class TmpDirectory {
  static create(): Directory {
    const { dirSync: tmpDirSync } = require('tmp');

    const tmpFile = tmpDirSync();

    return Directory.create(String(tmpFile.name));
  }
}
