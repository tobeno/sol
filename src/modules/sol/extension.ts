import { Directory } from '../storage/directory';
import { getSol } from './sol';
import { File } from '../storage/file';
import { logDebug, logError } from '@sol/utils/log';
import { getCurrentWorkspace, getUserWorkspace } from './workspace';

export class Extension {
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

  get globalsFile(): File {
    return this.dir.file('globals.ts');
  }

  get globals(): PropertyDescriptorMap {
    if (!this.globalsFile.exists) {
      return {};
    }

    try {
      return require(this.globalsFile.path).globals;
    } catch (e) {
      logError(e);
      return {};
    }
  }

  prepare(force = false): void {
    this.dir.create();

    const sol = getSol();

    const globalsFile = this.globalsFile;
    if (!globalsFile.exists || force) {
      globalsFile.create();
      globalsFile.text = `
/* eslint-disable */
// @ts-nocheck
      
import type { FromPropertyDescriptorMap } from '${sol.packageDir.relativePathFrom(
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
/* eslint-disable */
// @ts-nocheck
      
import { globals } from './globals';
import { definePropertiesMutation, mutateGlobals } from '${sol.packageDir.relativePathFrom(
        this.dir,
      )}/utils/mutation';
import { logDebug } from '${sol.packageDir.relativePathFrom(
        this.dir,
      )}/utils/log';

mutateGlobals(definePropertiesMutation(globals));

logDebug('Loaded ' + __filename);
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
    } catch (e) {
      logError(e);
    }

    logDebug(`Loaded extension ${this.name} at ${this.dir.path}`);
  }
}

let extensions: Extension[] | null = null;

export function getExtensions(): Extension[] {
  if (!extensions) {
    extensions = [];
  }

  return extensions;
}

export function getLoadedExtensions(): Extension[] {
  return getExtensions().filter((e) => e.loaded);
}

export function extension(
  pathOrExtension: string | Extension,
  extensionsPath: string | Directory | null = null,
): Extension {
  let foundExtension: Extension;
  if (typeof extensionsPath === 'string') {
    extensionsPath = Directory.create(extensionsPath);
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

  const extensions = getExtensions();

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

export function workspaceExtension(name: string): Extension {
  return extension(name, getCurrentWorkspace().dir);
}

export function userExtension(name: string): Extension {
  return extension(name, getUserWorkspace().dir);
}
