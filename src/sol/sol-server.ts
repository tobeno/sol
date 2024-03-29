import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { log, logDebug } from '../utils/log.utils';
import { getLoadedSolExtensions } from './sol-extension';
import { getSolPackage } from './sol-package';
import { solReplColor, startSolReplServer } from './sol-repl';
import { getCurrentSolWorkspace } from './sol-workspace';

/**
 * Update Sol from git remote.
 */
export function updateSol(): void {
  const packageDir = getSolPackage().dir;

  logDebug('Updating Sol...');
  logDebug('Fetching latest version from GitHub...');

  spawnSync('git pull --rebase', {
    cwd: packageDir.path,
    shell: true,
  });

  spawnSync('npm install', {
    cwd: packageDir.path,
    shell: true,
  });

  logDebug('Fetched latest version from GitHub');

  logDebug('Updated Sol');
}

/**
 * Start the full Sol interactive shell (REPL).
 */
export async function startSol(): Promise<void> {
  const server = await startSolReplServer();

  server.defineCommand('upgrade', {
    help: 'Upgrade Sol to latest version',
    action(): void {
      updateSol();
      server.close();

      log('✅ Sol updated successfully');

      process.exit(0);
    },
  });

  const loadedExtensions = getLoadedSolExtensions();
  const solPackage = getSolPackage();

  log(
    `
${chalk.bold(solReplColor.primary('-=| Welcome to Sol |=-'))}
Workspace: ${solReplColor.warn(getCurrentSolWorkspace().dir.path)}${
      loadedExtensions.length
        ? `
Extensions:
${loadedExtensions
  .map(
    (e: any) =>
      `- ${solReplColor.ok(e.name)} (${solReplColor.warn(e.dir.path)})`,
  )
  .join('\n')}`
        : ''
    }

Use ${solReplColor.primary(
      '.globals [filter]',
    )} to find out more about your options.

To enable additional extensions, load them in your workspace or user ${solReplColor.warn(
      'setup.ts',
    )} file (e.g. using ${solReplColor.primary(
      'solWorkspace.setupFile.edit()',
    )}).
You can create a new one by calling either ${solReplColor.primary(
      "solWorkspaceExtension('your-name').edit()",
    )} or ${solReplColor.primary("solUserExtension('your-name').edit()")}.

For usage details see: ${solReplColor.warn(`${solPackage.dir.path}/README.md`)}
`.trimEnd(),
  );

  server.displayPrompt();
}
