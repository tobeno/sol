#!/usr/bin/env node
const path = require('path');

require('ts-node').register({
  project: path.resolve(__dirname, '../tsconfig.json'),
  transpileOnly: true,
});

const { startSolServer } = require('../dist/src/repl');

startSolServer();
