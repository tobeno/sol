import { Directory } from './storage/directory';
import { sol } from './sol';

export class Extension {
  globals: any = {};
  loaded = false;

  constructor(public name: string, public dir: Directory) {}

  get setupFile() {
    return this.dir.file('setup.js');
  }

  generateSetupFile() {
    const extensionDir = this.dir;
    const extensionName = this.name;
    const extensionSetupFile = this.setupFile;
    const workspaceContextFile = sol.workspaceContextFile;
    if (extensionSetupFile.exists) {
      throw new Error(
        `Extension in ${extensionDir.path} already contains a setup.js file`,
      );
    }

    extensionSetupFile.create();

    extensionSetupFile.text = `
/* eslint-disable */
/**
* Setup file for workspace extension
*/

/// <reference path="${workspaceContextFile.dir.relativePathFrom(
      extensionSetupFile.dir,
    )}/${workspaceContextFile.basename}" />

const extension = sol.getExtension('${extensionName}');

/**
* Additional globals for the current workspace
*/
extension.registerGlobals({
workspace: {
  example() {
      console.log('Hello!');
  }
}
});
`.trimStart();
  }

  reload() {
    const extensionDir = this.dir;

    const modules = extensionDir.files('**/*.js').map((f) => f.path);
    modules.forEach((module) => {
      delete require.cache[module];
    });

    return this.load(true);
  }

  load(force = false) {
    if (!force && this.loaded) {
      return;
    }

    const extensionDir = this.dir;

    const setupFiles = extensionDir.files('setup.{ts,js}');
    if (!setupFiles.length) {
      throw new Error(
        `Extension ${name} (${extensionDir.path}) is missing setup.js / setup.ts file`,
      );
    }

    const setupFile = setupFiles[0];

    require(setupFile.pathWithoutExts);

    this.loaded = true;
  }

  registerGlobals(globals: any) {
    sol.registerGlobals(globals);

    Object.assign(this.globals, globals);
  }

  registerProperties(
    target: object,
    descriptors: PropertyDescriptorMap & ThisType<any>,
  ) {
    sol.registerProperties(target, descriptors);
  }
}
