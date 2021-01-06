require('./setup');

import * as repl from 'repl';
import { loopWhile } from 'deasync';
import { Sol } from './sol';
import { spawnSync } from 'child_process';
import * as chalk from 'chalk';
import { getSolMetadata } from './utils/metadata';
import { ReplOptions } from 'repl';
import { AsyncCompleter, CompleterResult } from 'readline';

let server: repl.REPLServer | null = null;

const color = {
  primary: chalk.keyword('coral'),
  ok: chalk.hex('83da44'),
  err: chalk.keyword('crimson'),
  warn: chalk.hex('ddd745'),
  dim: chalk.dim,
};

/**
 * Returns Sol instance dynamically (to ensure to correct version is used)
 */
function getSol(): Sol {
  return require('./sol').sol;
}

/**
 * Runs the build command for Sol
 */
function rebuildSol() {
  spawnSync('npm run build', {
    cwd: getSol().packageDir.path,
    shell: true,
  });
}

/**
 * Reloads the Sol globals without restart
 */
function reloadSolServer() {
  if (!server) {
    return;
  }

  let sol = getSol();

  const {
    runtimeDir,
    extensions,
    loadedExtensionNames,
    workspaceDirPath,
  } = sol;
  const modules = runtimeDir.files('**/*.js').map((f) => f.path);

  modules.forEach((module) => {
    delete require.cache[module];
  });

  require('./setup');

  // Refresh Sol instance
  sol = getSol();
  sol.workspaceDirPath = workspaceDirPath;
  sol.server = server;
  sol.reloadWorkspace();

  // Re-register extension using strings (to avoid issues with instanceof checks)
  sol.registerExtensions(extensions.map((extension) => extension.dir.path));
  sol.reloadExtensions(loadedExtensionNames);
}

function myWriter(output: any) {
  return chalk.bold(require('./utils/inspect').inspect(output));
}

async function myCompleter(line: string): Promise<CompleterResult | void> {
  // ToDo: Add custom completion logic
}

export function startSolServer(options: ReplOptions = {}) {
  server = repl.start({
    prompt: color.dim('> '),
    writer: myWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  let historyReady = false;
  server.setupHistory(getSol().historyFile.create().path, () => {
    historyReady = true;
  });
  loopWhile(() => !historyReady);

  const originalCompleter = server.completer.bind(repl);
  (server as any).completer = (async (line, cb) => {
    const result = await myCompleter(line);
    if (typeof result !== 'undefined') {
      cb(null, result);
    }

    originalCompleter(line, cb);
  }) as AsyncCompleter;

  server.defineCommand('rebuild', {
    help: 'Rebuilds and reloads Sol using the current source files',
    action() {
      rebuildSol();
      reloadSolServer();
      this.displayPrompt();
    },
  });

  server.defineCommand('reload', {
    help: 'Reloads Sol files to reflect latest build',
    action() {
      reloadSolServer();
      this.displayPrompt();
    },
  });

  server.defineCommand('extensions', {
    help: 'Lists Sol extensions',
    action() {
      const sol = getSol(); // Ensure we use current instance of Sol
      const extensions = sol.extensions;

      console.log(
        `${color.primary('Extensions')} (${color.ok('loaded')} and ${color.warn(
          'available',
        )}):`,
      );
      console.log(
        `${extensions
          .map(
            (extension) =>
              `- ${(extension.loaded ? color.ok : color.warn)(
                extension.name,
              )} (path: ${extension.dir.path})`,
          )
          .join('\n')}\n\nTo enable additional extensions update ${
          sol.workspaceSetupFile.path
        }`,
      );
      this.displayPrompt();
    },
  });

  server.defineCommand('globals', {
    help: 'Lists available Sol globals',
    action(filter?: string) {
      const sol = getSol(); // Ensure we use current instance of Sol
      const globals = sol.globals as any;

      const formatValue = (value: any, name: string, help?: string) => {
        const meta = getSolMetadata(value);
        if (!help && meta.help) {
          help = meta.help;
        }

        return `${
          typeof value !== 'function'
            ? color.warn(name)
            : `${color.ok(`${name}`)}${chalk.dim('(...)')}`
        }${help ? ` - ${help}` : ''}`;
      };

      const getProperties = (value: any): PropertyDescriptorMap => {
        if (
          !value ||
          [Array.prototype, Object.prototype, Function.prototype].includes(
            value,
          )
        ) {
          return {};
        }

        const proto =
          typeof value !== 'function'
            ? Object.getPrototypeOf(value)
            : value.prototype;

        const properties = {
          ...(proto ? getProperties(proto) : {}),
          ...Object.getOwnPropertyDescriptors(value),
        };

        return properties;
      };

      const getPropertyNames = (properties: PropertyDescriptorMap) => {
        return Object.keys(properties)
          .filter(
            (propertyName) =>
              !propertyName.startsWith('_') &&
              !['constructor', 'length', 'prototype'].includes(propertyName),
          )
          .sort((a, b) => {
            const aFunction = typeof properties[a].value === 'function' ? 1 : 0;
            const bFunction = typeof properties[b].value === 'function' ? 1 : 0;

            if (aFunction !== bFunction) {
              return aFunction - bFunction;
            }

            return a.localeCompare(b);
          });
      };

      console.log(
        `${color.primary('Globals')}${
          filter ? ` ${color.warn(`(filtered by '${filter}')`)}` : ''
        }:\n${
          getPropertyNames(globals)
            .filter(
              (name) =>
                !filter || name.toLowerCase().includes(filter.toLowerCase()),
            )
            .map((name) => {
              const descriptor = globals[name];
              const value = descriptor.value;
              const help = descriptor.help;
              let output = `- ${formatValue(value, name, help)}`;
              if (
                (typeof value === 'object' || /^[A-Z]/.test(name)) &&
                !['astTypes'].includes(name)
              ) {
                const innerProperties = getProperties(value);

                output += `\n${getPropertyNames(innerProperties)
                  .map((innerName) => {
                    const innerValue = innerProperties[innerName].value;

                    return `  - ${formatValue(innerValue, innerName)}`;
                  })
                  .join('\n')}`;
              }

              return output;
            })
            .join('\n') || color.err('No matches found')
        }\n\nBesides the Sol globals, you can also access the NodeJS core modules.\n\nYou can add additional globals by extending ${
          sol.workspaceExtension.setupFile.path
        } or by creating a new global extension in ${
          sol.globalExtensionsDir.path
        }`,
      );
      this.displayPrompt();
    },
  });

  const sol = getSol();
  sol.server = server;
  sol.loadWorkspace();
  console.log(
    `
${chalk.bold(color.primary('-=| Welcome to Sol |=-'))}
Workspace: ${color.warn(sol.workspaceDir.path)}
Extensions: ${
      sol.loadedExtensionNames.map((e) => color.ok(e)).join(', ') || '-'
    }

Use ${color.primary('.globals [filter]')} and ${color.primary(
      '.extensions',
    )} to find out more about your options.

For usage details see: ${color.warn(`${sol.packageDir.path}/README.md`)}
`.trimEnd(),
  );

  server.displayPrompt();

  return server;
}
