import chalk from 'chalk';
import type { AsyncCompleter, CompleterResult } from 'readline';
import type { REPLEval, ReplOptions, REPLServer } from 'repl';
import repl from 'repl';
import * as vm from 'vm';
import { log } from '../utils/log.utils';
import { getHelp } from '../utils/metadata.utils';
import {
  DefinePropertiesMutation,
  getAppliedMutations,
} from '../utils/mutation.utils';
import { prepareSolCommand } from './sol-command';
import { getCurrentSolWorkspace } from './sol-workspace';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

export const solReplColor = {
  primary: chalk.hex('ff7f50'),
  ok: chalk.hex('83da44'),
  err: chalk.hex('dc143c'),
  warn: chalk.hex('ddd745'),
  dim: chalk.dim,
};

/**
 * Default Sol REPL writer / output.
 */
function solWriter(output: any): string {
  return chalk.bold(require('../utils/inspect.utils').inspect(output));
}

/**
 * Default Sol REPL completion handling.
 */
async function solCompleter(_line: string): Promise<CompleterResult | void> {
  // ToDo: Add custom completion logic
}

/**
 * Default Sol REPL evaluation.
 */
const solEval: REPLEval = async (cmd, _context, _file, cb) => {
  try {
    const result = await vm.runInThisContext(prepareSolCommand(cmd), {});

    cb(null, result);
  } catch (err: any) {
    cb(err, null);
  }
};

/**
 * Enables the file based REPL history for the given server.
 */
async function setupSolReplHistory(server: REPLServer): Promise<void> {
  return new Promise((resolve) => {
    server.setupHistory(
      getCurrentSolWorkspace().dir.file('history').create().path,
      () => {
        resolve();
      },
    );
  });
}

/**
 * Adds the default REPL completion to the given server.
 */
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

/**
 * Adds the default Sol REPL commands to the given server.
 */
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
          let help: string | null = getHelp(value);

          if (!help) {
            const obj: { tmp: any } = {} as any;
            Object.defineProperty(obj, 'tmp', value);

            help = getHelp(obj.tmp);
          }

          return `- ${solReplColor.primary(key)}${help ? `: ${help.split('\n')[0]}` : ''}`;
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

/**
 * Returns the currently running REPL server.
 */
export function getSolReplServer(): REPLServer {
  if (!currentServer) {
    throw new Error('REPL server not started.');
  }

  return currentServer;
}

/**
 * Starts the Sol REPL server (interactive shell).
 */
export async function startSolReplServer(
  options: ReplOptions = {},
): Promise<REPLServer> {
  const server = repl.start({
    prompt: solReplColor.dim('> '),
    eval: solEval,
    writer: solWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  currentServer = server;

  await setupSolReplHistory(server);
  setupSolReplCompleter(server);
  setupSolReplCommands(server);

  return server;
}
