import { dir, Directory } from '../storage/directory';
import { sol } from './sol';
import { File } from '../storage/file';
import { logDebug, logError } from '../utils/log';

export class Extension {
  static extensions = [];

  readonly dir: Directory;

  constructor(path: string) {
    this.dir = dir(path);
  }

  get name(): string {
    return this.dir.basename;
  }

  get setupFile(): File {
    return this.dir.file('setup.ts');
  }

  get globalsFile(): File {
    return this.dir.file('globals.ts');
  }

  get globals(): PropertyDescriptorMap {
    if (!this.globalsFile.exists) {
      return {};
    }

    return require(this.globalsFile.path).globals;
  }

  prepare(force = false): void {
    this.dir.create();

    const globalsFile = this.globalsFile;
    if (!globalsFile.exists || force) {
      globalsFile.create();
      globalsFile.text = `
import type { FromPropertyDescriptorMap } from '${sol.packageDistDir.relativePathFrom(
        this.dir,
      )}/interfaces/object';

export const globals = {
   example: {
      value(): string {
         return 'Hello world!';
      }
   }
}

export type Globals = FromPropertyDescriptorMap<typeof globals>;
`.trimStart();
    }

    const setupFile = this.setupFile;
    if (!setupFile.exists || force) {
      setupFile.create();
      setupFile.text = `
import { globals } from './globals';
import { definePropertiesMutation, mutateGlobals } from '${sol.packageDistDir.relativePathFrom(
        this.dir,
      )}/modules/utils/mutation';
import { logDebug } from '${sol.packageDistDir.relativePathFrom(
        this.dir,
      )}/modules/utils/log';

mutateGlobals(definePropertiesMutation(globals));

logDebug('Loaded ' + __filename);
`.trimStart();
    }
  }

  load(): void {
    logDebug(`Loading extension ${this.name} at ${this.dir.path}...`);

    this.prepare();

    try {
      require(this.setupFile.path);
    } catch (e) {
      logError(e);
    }

    logDebug(`Loaded extension ${this.name} at ${this.dir.path}`);
  }
}

export const loadedExtensions: Extension[] = [];

export function extension(
  pathOrExtension: string | Extension,
  extensionsPath: string | Directory | null = null,
): Extension {
  let foundExtension: Extension;
  if (typeof extensionsPath === 'string') {
    extensionsPath = dir(extensionsPath);
  }

  if (pathOrExtension instanceof Extension) {
    foundExtension = pathOrExtension;
  } else {
    foundExtension = new Extension(
      extensionsPath
        ? extensionsPath.dir('extensions').file(pathOrExtension).path
        : pathOrExtension,
    );
  }

  const loadedExtension = loadedExtensions.find(
    (e) => e.dir.path === foundExtension.dir.path,
  );
  if (loadedExtension) {
    foundExtension = loadedExtension;
  } else {
    loadedExtensions.push(foundExtension);
  }

  return foundExtension;
}

export function workspaceExtension(name: string): Extension {
  return extension(name, sol.workspace.dir);
}

export function userExtension(name: string): Extension {
  return extension(name, sol.userWorkspace.dir);
}
