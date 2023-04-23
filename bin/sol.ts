#!/usr/bin/env tsx

import '../src/setup';

const args = process.argv.slice(2);
if (args.length > 0 && args[0] !== '--') {
  const { runCommand } = require('../src/modules/cli/commands');

  runCommand(args[0], args.slice(1));
} else {
  const { startSol } = require('../src/modules/sol/sol-server');

  startSol();
}
