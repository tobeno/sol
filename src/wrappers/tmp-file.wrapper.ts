import { File } from './file.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

export class TmpFile {
  static create(ext: string | null = null): File {
    const { fileSync: tmpFileSync } = require('tmp');

    const tmpFile = tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    });

    return File.create(String(tmpFile.name));
  }
}
