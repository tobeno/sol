import { Directory } from './directory.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

export class TmpDirectory {
  static create(): Directory {
    const { dirSync: tmpDirSync } = require('tmp');

    const tmpFile = tmpDirSync();

    return Directory.create(String(tmpFile.name));
  }
}
