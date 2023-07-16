#!/usr/bin/env tsx

import '../src/optimize';
import '../src/setup';
import { loadSol } from '../src/sol/sol-setup';

(async () => {
  if (process.env.DEBUG_PERFORMANCE === 'true') {
    const { getLoadedModules } =
      require('../src/utils/debug.utils') as typeof import('../src/utils/debug.utils');

    console.log(
      getLoadedModules()
        .map((m) => `${m.file.relativePath} -- ${m.size}`)
        .join('\n'),
    );
  }

  loadSol();

  const args = process.argv.slice(2);
  if (args.length > 0 && args[0] !== '--') {
    const { runCli } = require('../src/cli');

    await runCli(args);
  } else {
    const { startSol } = require('../src/sol/sol-server');

    await startSol();
  }
})();
