import { Directory } from './storage/directory';
import { sol } from './sol';
import { SolPropertyDescriptorMap } from './interfaces/properties';
import { log } from './log';

export class Extension {
  globals: SolPropertyDescriptorMap = {};
  loaded = false;

  constructor(public name: string, public dir: Directory) {}

  get setupFile() {
    return this.dir.file('setup.ts');
  }

  get globalsFile() {
    return this.dir.file('globals.ts');
  }

  generateSetupFile() {
    const extensionDir = this.dir;
    const extensionName = this.name;
    const extensionSetupFile = this.setupFile;
    const workspaceContextFile = sol.workspaceContextFile;
    if (extensionSetupFile.exists) {
      throw new Error(
        `Extension in ${extensionDir.path} already contains a setup.ts file`,
      );
    }

    extensionSetupFile.create();

    extensionSetupFile.text = `
/* eslint-disable */
/**
* Setup file for workspace extension
*/

import './${workspaceContextFile.dir.relativePathFrom(
      extensionSetupFile.dir,
    )}/${workspaceContextFile.basenameWithoutExt}';
${
  this.globalsFile.exists
    ? `
import { globals } from './globals';

const extension = sol.getExtension('${extensionName}');

extension.registerGlobals(globals);
`.trimStart()
    : ''
}
`.trimStart();
  }

  generateGlobalsFile() {
    const extensionDir = this.dir;
    const extensionGlobalsFile = this.globalsFile;
    if (extensionGlobalsFile.exists) {
      throw new Error(
        `Extension in ${extensionDir.path} already contains a setup.ts file`,
      );
    }

    extensionGlobalsFile.create();

    extensionGlobalsFile.text = `
/* eslint-disable */
/**
* Global variables declarations for workspace
*/

export const globals = {
   workspace: {
    help: 'Workspace utilities',
    value: {
      example() {
        console.log('Hello!');
      },
    },
  },
};

export type Globals = typeof globals;
`.trimStart();
  }

  reload() {
    const extensionDir = this.dir;

    const modules = extensionDir
      .files('**/*.{js,ts}')
      .map((f) => f.pathWithoutExt);
    modules.forEach((module) => {
      delete require.cache[require.resolve(module)];
    });

    return this.load(true);
  }

  load(force = false) {
    if (!force && this.loaded) {
      return;
    }

    try {
      require(this.setupFile.pathWithoutExt);
    } catch (e) {
      log(`Failed to load extension '${this.name}'.`);
    }

    this.loaded = true;
  }

  registerGlobals(globals: SolPropertyDescriptorMap) {
    const globalGeneric = global as any;

    this.registerProperties(globalGeneric, globals);
    Object.assign(this.globals, globals);
  }

  registerProperties(
    target: object,
    properties: SolPropertyDescriptorMap & ThisType<any>,
  ) {
    sol.registerProperties(target, properties);
  }
}
