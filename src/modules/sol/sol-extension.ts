import { Directory } from '../storage/directory';
import { getSol } from './sol';
import { File } from '../storage/file';
import { logDebug, logError } from '../../utils/log';
import { getCurrentSolWorkspace, getSolUserWorkspace } from './sol-workspace';
import { camelcaseText } from '../../utils/text';

export class SolExtension {
  static extensions = [];

  readonly dir: Directory;
  loaded = false;

  constructor(path: string) {
    this.dir = Directory.create(path);
  }

  get name(): string {
    return this.dir.basename;
  }

  get setupFile(): File {
    return this.dir.file('setup.ts');
  }

  prepare(force = false): void {
    this.dir.create();

    const sol = getSol();

    const globalMutationFile = this.dir.file('mutations/global.mutation.ts');
    const setupFile = this.setupFile;
    if (!setupFile.exists || force) {
      setupFile.create();
      setupFile.text = `
/* eslint-disable */
      
import './${globalMutationFile.dir.relativePathFrom(setupFile.dir)}/${
        globalMutationFile.basenameWithoutExt
      }';
`.trimStart();
    }

    if (!globalMutationFile.exists || force) {
      if (!globalMutationFile.dir.exists) {
        globalMutationFile.dir.create();
      }

      let globalName = camelcaseText(this.name);
      globalMutationFile.text = `
/* eslint-disable */

import { withHelp } from '${sol.packageDir.relativePathFrom(
        globalMutationFile.dir,
      )}/src/utils/metadata';
import { definePropertiesMutation, mutateGlobals } from '${sol.packageDir.relativePathFrom(
        globalMutationFile.dir,
      )}/src/utils/mutation';
import { FromPropertyDescriptorMap } from '${sol.packageDir.relativePathFrom(
        globalMutationFile.dir,
      )}/src/interfaces/object';

const globals = {
  ${globalName}: withHelp(
    {
      value: {
        hello() {
          return 'world';
        }
      },
    },
    'Limehome utilities'
  ),
};

type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const ${globalName}: Globals['${globalName}'];
}

mutateGlobals(definePropertiesMutation(globals));
`.trimStart();
    }
  }

  load(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    logDebug(`Loading extension ${this.name} at ${this.dir.path}...`);

    this.prepare();

    try {
      require(this.setupFile.path);
      logDebug(`Loaded setup file at ${this.setupFile.path}`);
    } catch (e) {
      logError(e);
    }

    logDebug(`Loaded extension ${this.name} at ${this.dir.path}`);
  }
}

let solExtensions: SolExtension[] | null = null;

export function getSolExtensions(): SolExtension[] {
  if (!solExtensions) {
    solExtensions = [];
  }

  return solExtensions;
}

export function getLoadedSolExtensions(): SolExtension[] {
  return getSolExtensions().filter((e) => e.loaded);
}

export function solExtension(
  pathOrExtension: string | SolExtension,
  extensionsPath: string | Directory | null = null,
): SolExtension {
  let foundExtension: SolExtension;
  if (typeof extensionsPath === 'string') {
    extensionsPath = Directory.create(extensionsPath);
  }

  if (pathOrExtension instanceof SolExtension) {
    foundExtension = pathOrExtension;
  } else {
    foundExtension = new SolExtension(
      extensionsPath
        ? extensionsPath.dir('extensions').file(pathOrExtension).path
        : pathOrExtension,
    );
  }

  const extensions = getSolExtensions();

  const existingExtension = extensions.find(
    (e) => e.dir.path === foundExtension.dir.path,
  );
  if (existingExtension) {
    foundExtension = existingExtension;
  } else {
    extensions.push(foundExtension);
  }

  return foundExtension;
}

export function solWorkspaceExtension(name: string): SolExtension {
  return solExtension(name, getCurrentSolWorkspace().dir);
}

export function solUserExtension(name: string): SolExtension {
  return solExtension(name, getSolUserWorkspace().dir);
}
