#!/usr/bin/env tsx

import '../src/optimize';
import '../src/setup';
import { getLoadedModules } from '../src/utils/debug';

const args = process.argv.slice(2);
if (args.length > 0 && args[0] !== '--') {
  const { runCommand } = require('../src/modules/cli/commands');

  runCommand(args[0], args.slice(1));
} else {
  const { startSol } = require('../src/modules/sol/sol-server');

  if (process.env.DEBUG_PERFORMANCE === 'true') {
    console.log(
      getLoadedModules()
        .map((m) => `${m.file.relativePath} -- ${m.size}`)
        .join('\n'),
    );
  }

  startSol();
}
