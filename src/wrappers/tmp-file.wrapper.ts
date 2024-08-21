import { File } from './file.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

export class TmpFile {
  static readonly usageHelp = `
> tmpFile('md').md = '# Title'
  `.trim();

  static create(ext: string | null = null): File {
    const { fileSync: tmpFileSync } = require('tmp');

    const tmpFile = tmpFileSync({
      ...(ext ? { postfix: `.${ext}` } : {}),
    });

    const result = File.create(String(tmpFile.name));

    return withHelp(
      result,
      `
File wrapper around a temporary file.

Usage:
${TmpFile.usageHelp}
    `,
    );
  }
}
