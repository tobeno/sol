import { Directory } from './storage/directory';
import { sol } from './sol';
import { log } from './log';
import { registerObjectProperties } from './utils/object';

export class Extension {
  globals: Record<string, any> = {};
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
// @ts-nocheck
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

  generateGlobalsFile(recreate = false) {
    const extensionDir = this.dir;
    const extensionGlobalsFile = this.globalsFile;
    if (extensionGlobalsFile.exists && !recreate) {
      throw new Error(
        `Extension in ${extensionDir.path} already contains a globals.ts file`,
      );
    }

    extensionGlobalsFile.create();

    extensionGlobalsFile.text = `
// @ts-nocheck
/* eslint-disable */
/**
* Global variables declarations for workspace
*/

import { withHelp } from './${sol.runtimeDir.relativePathFrom(
      extensionGlobalsFile.dir,
    )}/utils/metadata';

export const globals = {
   workspace: withHelp({
      example() {
        console.log('Hello!');
      },
    }, 'Workspace utilities'),
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
      log(`Failed to load extension '${this.name}'.`, e);
    }

    this.loaded = true;
  }

  registerGlobals(globals: Record<string, any>) {
    const globalGeneric = global as any;

    registerObjectProperties(globalGeneric, globals);
    Object.assign(this.globals, globals);
  }

  registerProperties(
    target: object,
    properties: Record<string, any> | (PropertyDescriptorMap & ThisType<any>),
  ) {
    registerObjectProperties(target, properties);
  }
}
