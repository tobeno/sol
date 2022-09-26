import type { ReplOptions, REPLServer } from 'repl';
import repl from 'repl';
import { loopWhile } from 'deasync';
import chalk from 'chalk';
import type { AsyncCompleter, CompleterResult } from 'readline';
import { log } from '../../utils/log';
import { getSolMetadata } from '../../utils/metadata';
import { getCurrentSolWorkspaceDir } from './sol-workspace';
import {
  DefinePropertiesMutation,
  getAppliedMutations,
} from '../../utils/mutation';

export const solReplColor = {
  primary: chalk.keyword('coral'),
  ok: chalk.hex('83da44'),
  err: chalk.keyword('crimson'),
  warn: chalk.hex('ddd745'),
  dim: chalk.dim,
};

function solWriter(output: any): string {
  return chalk.bold(require('../../utils/inspect').inspect(output));
}

async function solCompleter(line: string): Promise<CompleterResult | void> {
  // ToDo: Add custom completion logic
}

function setupSolReplHistory(server: REPLServer): void {
  let historyReady = false;
  server.setupHistory(
    getCurrentSolWorkspaceDir().file('history').create().path,
    () => {
      historyReady = true;
    },
  );
  loopWhile(() => !historyReady);
}

function setupSolReplCompleter(server: REPLServer): void {
  const originalCompleter = server.completer.bind(repl);
  (server as any).completer = (async (line, cb) => {
    const result = await solCompleter(line);
    if (typeof result !== 'undefined') {
      cb(null, result);
    }

    originalCompleter(line, cb);
  }) as AsyncCompleter;
}

function setupSolReplCommands(server: REPLServer): void {
  server.defineCommand('globals', {
    help: 'Shows available globals',
    action(filter: string | null = null): void {
      let globalEntries = getAppliedMutations(global)
        .filter(
          (mutation): mutation is DefinePropertiesMutation<typeof global> =>
            mutation instanceof DefinePropertiesMutation,
        )
        .reduce(
          (result, mutation) => [
            ...result,
            ...Object.entries(mutation.properties),
          ],
          [] as [string, PropertyDescriptor][],
        )
        .sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]));

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

          return `- ${solReplColor.primary(key)}${help ? `: ${help}` : ''}`;
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

export function getSolReplServer(): REPLServer {
  if (!currentServer) {
    throw new Error('REPL server not started.');
  }

  return currentServer;
}

export function startSolReplServer(options: ReplOptions = {}): REPLServer {
  const server = repl.start({
    prompt: solReplColor.dim('> '),
    writer: solWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  currentServer = server;

  setupSolReplHistory(server);
  setupSolReplCompleter(server);
  setupSolReplCommands(server);

  return server;
}