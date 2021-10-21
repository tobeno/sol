#!/usr/bin/env node
const path = require('path');

require('ts-node').register({
  project: path.resolve(__dirname, '../tsconfig.json'),
  transpileOnly: true,
});

require('../dist/src/setup');
const { startSolServer } = require('../dist/src/modules/sol/repl');

startSolServer();
