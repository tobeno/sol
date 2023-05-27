import { File } from './file';

export class TmpFile {
  static create(ext: string | null = null): File {
    const { fileSync: tmpFileSync } = require('tmp');

    const tmpFile = tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    });

    return File.create(String(tmpFile.name));
  }
}
