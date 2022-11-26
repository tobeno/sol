const path = require('path');
const fs = require('fs');

const rootPath = path.resolve(__dirname, '..');

const { register } = require('esbuild-register/dist/node');

const tsconfig = JSON.parse(
  fs
    .readFileSync(path.join(rootPath, 'tsconfig.json'), 'utf8')
    .replace(/(\s\/\*[^/]+?\*\/|\n *\/\/.+)/g, ''),
);

register({
  tsconfigRaw: tsconfig,
  target: 'node16',
});

require('../src/setup');
