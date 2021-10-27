import type { ReplOptions, REPLServer } from 'repl';
import * as repl from 'repl';
import { loopWhile } from 'deasync';
import { sol } from './sol';
import * as chalk from 'chalk';
import type { AsyncCompleter, CompleterResult } from 'readline';
import { log } from '../utils/log';
import { loadedExtensions } from './extension';
import { globals } from '../globals/globals';
import { getSolMetadata } from '../utils/metadata';
import { workspace } from './workspace';

const color = {
  primary: chalk.keyword('coral'),
  ok: chalk.hex('83da44'),
  err: chalk.keyword('crimson'),
  warn: chalk.hex('ddd745'),
  dim: chalk.dim,
};

function solWriter(output: any) {
  return chalk.bold(require('../utils/inspect').inspect(output));
}

async function solCompleter(line: string): Promise<CompleterResult | void> {
  // ToDo: Add custom completion logic
}

function setupReplHistory(server: REPLServer): void {
  let historyReady = false;
  server.setupHistory(workspace.historyFile.create().path, () => {
    historyReady = true;
  });
  loopWhile(() => !historyReady);
}

function setupReplCompleter(server: REPLServer): void {
  const originalCompleter = server.completer.bind(repl);
  (server as any).completer = (async (line, cb) => {
    const result = await solCompleter(line);
    if (typeof result !== 'undefined') {
      cb(null, result);
    }

    originalCompleter(line, cb);
  }) as AsyncCompleter;
}

function setupReplCommands(server: REPLServer): void {
  server.defineCommand('globals', {
    help: 'Shows available globals',
    action(filter: string | null = null) {
      let globalEntries = [
        ...new Set([
          ...Object.entries(globals),
          ...loadedExtensions.flatMap((e) => Object.entries(e.globals)),
        ]),
      ].sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]));

      if (filter) {
        globalEntries = globalEntries.filter(([key]) => key.includes(filter));
      }

      log(
        `
Available globals:
${
  globalEntries.length
    ? globalEntries
        .map(([key, value]) => {
          const help = getSolMetadata(value)?.help;

          return `- ${color.primary(key)}${help ? `: ${help}` : ''}`;
        })
        .join('\n')
    : 'No matches found'
}
`.trimStart(),
      );

      server.displayPrompt();
    },
  });
}

let currentServer: REPLServer | null = null;

export function getReplServer(): REPLServer {
  if (!currentServer) {
    throw new Error('REPL server not started.');
  }

  return currentServer;
}

export function startReplServer(options: ReplOptions = {}): REPLServer {
  const server = repl.start({
    prompt: color.dim('> '),
    writer: solWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  currentServer = server;

  setupReplHistory(server);
  setupReplCompleter(server);
  setupReplCommands(server);

  log(
    `
${chalk.bold(color.primary('-=| Welcome to Sol |=-'))}
Workspace: ${color.warn(workspace.dir)}${
      loadedExtensions.length
        ? `
Extensions:
${loadedExtensions
  .map((e) => `- ${color.ok(e.name)} (${color.warn(e.dir.path)})`)
  .join('\n')}`
        : ''
    }

Use ${color.primary('.globals [filter]')} to find out more about your options.

To enable additional extensions, load them in your workspace or user ${color.warn(
      'setup.ts',
    )} file (e.g. using ${color.primary('workspace.setupFile.edit()')}).
You can create a new one by calling either ${color.primary(
      "workspaceExtension('your-name').edit()",
    )} or ${color.primary("userExtension('your-name').edit()")}.

For usage details see: ${color.warn(`${sol.packageDir.path}/README.md`)}
`.trimEnd(),
  );

  return server;
}
