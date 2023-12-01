#!/usr/bin/env tsx

import '../src/setup';
import { loadSol } from '../src/sol/sol-setup';

(async () => {
  if (process.env.DEBUG_PERFORMANCE === 'true') {
    const { getLoadedModules } = await import('../src/utils/debug.utils');

    console.log(
      getLoadedModules()
        .map((m) => `${m.file.relativePath} -- ${m.size}`)
        .join('\n'),
    );
  }

  await loadSol();

  const args = process.argv.slice(2);
  if (args.length > 0 && args[0] !== '--') {
    const { runCli } = await import('../src/cli');

    await runCli(args);
  } else {
    const { startSol } = await import('../src/sol/sol-server');

    await startSol();
  }
})();
