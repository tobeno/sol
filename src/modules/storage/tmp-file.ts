import { File } from './file';
import { fileSync as tmpFileSync } from 'tmp';

export class TmpFile {
  static create(ext: string | null = null): File {
    const tmpFile = tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    });

    return File.create(String(tmpFile.name));
  }
}
