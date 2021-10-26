import { fileSync as tmpFileSync } from 'tmp';
import { File } from './file';

export function tmp(ext?: string): File {
  return new File(
    tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    }).name,
  );
}
