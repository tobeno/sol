import path from 'path';

export function getCwd() {
  return process.cwd();
}

export function getSolPath() {
  let rootPath = path.resolve(__dirname, '../../..');

  if (path.basename(rootPath) === 'dist') {
    rootPath = path.dirname(rootPath);
  }

  return rootPath;
}
