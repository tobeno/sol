import { fileSync as tmpFileSync } from 'tmp';
import { File } from './file';

/**
 * Returns a temporary file.
 */
export function tmp(ext?: string): File {
  return File.create(
    tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    }).name,
  );
}
