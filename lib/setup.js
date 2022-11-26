const path = require('path');
const fs = require('fs');

const rootPath = path.resolve(__dirname, '..');

const { register } = require('@swc-node/register/register');

const tsconfig = JSON.parse(
  fs
    .readFileSync(path.join(rootPath, 'tsconfig.json'), 'utf8')
    .replace(/(\s\/\*[^/]+?\*\/|\n *\/\/.+)/g, ''),
);

register(tsconfig.compilerOptions);

require('../src/setup');
