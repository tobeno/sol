import { Directory } from './directory.wrapper';

export class TmpDirectory {
  static create(): Directory {
    const { dirSync: tmpDirSync } = require('tmp');

    const tmpFile = tmpDirSync();

    return Directory.create(String(tmpFile.name));
  }
}
