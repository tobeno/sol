#!/usr/bin/env tsx

import '../src/optimize';
import '../src/setup';
import { getLoadedModules } from '../src/utils/debug.utils';

const args = process.argv.slice(2);
if (args.length > 0 && args[0] !== '--') {
  const command = args[0];
  const commandArgs = args.slice(1);
  switch (command) {
    case 'play':
      playFile(commandArgs[0] || null).replay();
      break;
    default:
      throw new Error(`Unknown command ${command}`);
  }
} else {
  const { startSol } = require('../src/sol/sol-server');

  if (process.env.DEBUG_PERFORMANCE === 'true') {
    console.log(
      getLoadedModules()
        .map((m) => `${m.file.relativePath} -- ${m.size}`)
        .join('\n'),
    );
  }

  startSol();
}
