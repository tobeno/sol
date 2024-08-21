import { Directory } from './directory.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

export class TmpDirectory {
  static readonly usageHelp = `
> tmpDirectory().files()
  `.trim();

  static create(): Directory {
    const { dirSync: tmpDirSync } = require('tmp');

    const tmpFile = tmpDirSync();

    const result = Directory.create(String(tmpFile.name));

    return withHelp(
      result,
      `
Directory wrapper around a temporary directory.

Usage:
${TmpDirectory.usageHelp}
    `,
    );
  }
}
