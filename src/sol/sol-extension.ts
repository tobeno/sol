import { logDebug, logError } from '../utils/log';
import { camelcaseText } from '../utils/text';
import { Directory } from '../wrappers/directory';
import { File } from '../wrappers/file';
import { getSolPackage } from './sol-package';
import { getCurrentSolWorkspace, getSolUserWorkspace } from './sol-workspace';

/**
 * Class for loading a Sol extension.
 */
export class SolExtension {
  readonly dir: Directory;
  loaded = false;

  constructor(path: string) {
    this.dir = Directory.create(path);
  }

  /**
   * Returns the name of the Sol extension.
   */
  get name(): string {
    return this.dir.basename;
  }

  /**
   * Returns the setup file of the Sol extension.
   */
  get setupFile(): File {
    return this.dir.file('setup.ts');
  }

  prepare(force = false): void {
    this.dir.create();

    const solPackage = getSolPackage();

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

import { withHelp } from '${solPackage.dir.relativePathFrom(
        globalMutationFile.dir,
      )}/src/utils/metadata';
import { definePropertiesMutation, mutateGlobals } from '${solPackage.dir.relativePathFrom(
        globalMutationFile.dir,
      )}/src/utils/mutation';
import { FromPropertyDescriptorMap } from '${solPackage.dir.relativePathFrom(
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

  /**
   * Loads the Sol extension using its setup file.
   */
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

/**
 * Returns all registered Sol extensions.
 */
export function getSolExtensions(): SolExtension[] {
  if (!solExtensions) {
    solExtensions = [];
  }

  return solExtensions;
}

/**
 * Returns all loaded Sol extensions.
 */
export function getLoadedSolExtensions(): SolExtension[] {
  return getSolExtensions().filter((e) => e.loaded);
}

/**
 * Returns a Sol extension for the given path.
 */
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

/**
 * Returns the Sol extension for the given name in the workspace.
 */
export function solWorkspaceExtension(name: string): SolExtension {
  return solExtension(name, getCurrentSolWorkspace().dir);
}

/**
 * Returns the Sol extension for the given name for the current user.
 */
export function solUserExtension(name: string): SolExtension {
  return solExtension(name, getSolUserWorkspace().dir);
}
