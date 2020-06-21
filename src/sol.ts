import { homedir } from 'os';
import { REPLServer } from 'repl';
import { Directory, dir } from './storage/directory';
import { File, file } from './storage/file';
import { Extension } from './extension';

export class Sol {
  server: REPLServer | null = null;
  globals = {};
  extensions: Extension[] = [];

  get loadedExtensionNames() {
    return this.extensions
      .filter((extension) => extension.loaded)
      .map((extension) => extension.name);
  }

  get packageExtensionNames() {
    return this.packageExtensionsDir.dirs().map((dir) => dir.name);
  }

  get globalExtensionNames() {
    return this.globalExtensionsDir.dirs().map((dir) => dir.name);
  }

  get workspaceExtensionNames() {
    return this.workspaceExtensionsDir.dirs().map((dir) => dir.name);
  }

  get extensionNames() {
    return Object.keys(this.extensions).sort();
  }

  get packageDir(): Directory {
    return this.runtimeDir.parent;
  }

  get packageDistDir(): Directory {
    return this.packageDir.dir('dist');
  }

  get packageSrcDir(): Directory {
    return this.packageDir.dir('src');
  }

  get packageExtensionsDir(): Directory {
    return this.runtimeDir.dir('extensions');
  }

  get runtimeDir(): Directory {
    return dir(__dirname);
  }

  get globalDir(): Directory {
    return dir(`${homedir()}/.sol`);
  }

  get globalExtensionsDir(): Directory {
    return this.globalDir.dir('extensions');
  }

  get historyFile(): File {
    return this.globalDir.file('history');
  }

  get workspaceDir(): Directory {
    return dir('.sol');
  }

  get workspaceExtensionsDir(): Directory {
    return this.workspaceDir.dir('extensions');
  }

  get workspaceGeneratedDir(): Directory {
    return this.workspaceDir.dir('generated');
  }

  get playDir(): Directory {
    return this.workspaceDir.dir('play');
  }

  get playContextFile(): File {
    return this.workspaceGeneratedDir.file('play-context.d.ts');
  }

  get workspaceContextFile(): File {
    return this.workspaceGeneratedDir.file('workspace-context.d.ts');
  }

  get workspaceSetupFile(): File {
    return this.workspaceDir.file('setup.js');
  }

  setupWorkspace() {
    const workspaceDir = this.workspaceDir;
    workspaceDir.create();

    const gitignoreFile = workspaceDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    const extensionsDir = this.workspaceExtensionsDir;
    if (!extensionsDir.exists) {
      const extensionDir = extensionsDir.dir('workspace');
      const extension = new Extension('workspace', extensionDir);
      extension.generateSetupFile();
    }

    this.registerDefaultExtensions();

    const setupFile = this.workspaceSetupFile;
    if (!setupFile.exists) {
      this.generateWorkspaceSetupFile();
    }

    this.loadWorkspaceSetupFile();

    this.updateWorkspace();
  }

  generateWorkspaceSetupFile() {
    const {
      workspaceDir,
      workspaceSetupFile,
      workspaceContextFile,
      workspaceExtensionNames,
      globalExtensionNames,
      packageExtensionNames,
    } = this;
    if (workspaceSetupFile.exists) {
      throw new Error(
        `Workspace in ${workspaceDir.path} already contains a setup.js file`,
      );
    }

    workspaceSetupFile.create();

    workspaceSetupFile.text = `
/* eslint-disable */
/**
* Setup file for workspace
*/

/// <reference path="${workspaceContextFile.dir.relativePathFrom(
      workspaceSetupFile.dir,
    )}/${workspaceContextFile.basename}" />

// --- Integrated Extensions (${this.packageExtensionsDir.path}) ---
${packageExtensionNames
  .map((name) => {
    return `// sol.loadExtension('${name}');`;
  })
  .join('\n')}

// --- Global Extensions (${this.globalExtensionsDir.path}) ---
${
  globalExtensionNames
    .map((name) => {
      return `// sol.loadExtension('${name}');`;
    })
    .join('\n') || '// No global extensions yet'
}

// --- Workspace extensions (${this.workspaceExtensionsDir.relativePath}) ---
${
  workspaceExtensionNames
    .map((name) => {
      return `sol.loadExtension('${name}');`;
    })
    .join('\n') || '// No workspace extensions yet'
}
`.trimStart();
  }

  updateWorkspace() {
    const {
      workspaceGeneratedDir,
      playContextFile,
      packageDistDir,
      workspaceContextFile,
    } = this;

    workspaceGeneratedDir.create();

    playContextFile.text = `
import '${workspaceContextFile.dir.relativePathFrom(playContextFile.dir)}/${
      workspaceContextFile.name
    }';
`.trimStart();

    workspaceContextFile.text = `
import { globals } from '${packageDistDir.relativePathFrom(
      workspaceContextFile.dir,
    )}/globals';

export type Globals = typeof globals;

declare global {
  const {
    ${Object.keys(this.globals).join(',\n    ')}
  }: Globals;

  namespace NodeJS {
    interface Global extends Globals {}
  }
}
`.trimStart();
  }

  playFile(path?: string): File {
    path = path || `play-${new Date().toISOString().replace(/[^0-9]/g, '')}`;

    if (!path.endsWith('.js')) {
      path += '.js';
    }

    let playFile;
    if (!path.includes('/')) {
      playFile = this.playDir.file(path);
    } else {
      playFile = file(path);
    }

    return playFile;
  }

  clearHistory() {
    if (!this.server) {
      return;
    }

    (this.server as any).history = [];
    this.historyFile.clear();
  }

  registerGlobals(globals: any) {
    const globalGeneric = global as any;

    Object.assign(globalGeneric, globals);
    Object.assign(this.globals, globals);
  }

  registerDefaultExtensions() {
    this.registerExtensions(this.packageExtensionsDir.dirs());
    this.registerExtensions(this.globalExtensionsDir.dirs());
    this.registerExtensions(this.workspaceExtensionsDir.dirs());
  }

  registerExtension(extension: string | Directory | Extension): Extension {
    let extensionDir: Directory;
    let name: string;
    if (!(extension instanceof Extension)) {
      if (typeof extension === 'string') {
        if (!extension.includes('/')) {
          extensionDir = this.packageExtensionsDir.dir(extension);
        } else {
          extensionDir = dir(extension);
        }
      } else {
        extensionDir = extension;
      }

      name = extensionDir.name;
      extension = new Extension(name, extensionDir);
    } else {
      name = extension.name;
      extensionDir = extension.dir;
    }

    const oldExtension = this.extensions.find(
      (extension) => extension.name === name,
    );
    if (oldExtension) {
      if (oldExtension.dir.path === extensionDir.path) {
        return oldExtension;
      }

      throw new Error(
        `Conflict between extensions for name ${name}: ${oldExtension.dir.path} vs. ${extensionDir.path}`,
      );
    }

    this.extensions.push(extension);

    return extension;
  }

  registerExtensions(
    extensions: (string | Directory | Extension)[],
  ): Extension[] {
    return extensions.map((extension) => this.registerExtension(extension));
  }

  reloadExtension(name: string): Extension {
    const extension = this.getExtension(name);
    extension.reload();

    return extension;
  }

  reloadExtensions(names: string[]): Extension[] {
    return names.map((name) => this.reloadExtension(name));
  }

  loadExtension(name: string, force = false): Extension {
    const extension = this.getExtension(name);
    if (!force && extension.loaded) {
      return extension;
    }

    extension.load(force);

    return extension;
  }

  loadExtensions(names: string[]): Extension[] {
    return names.map((name) => this.loadExtension(name));
  }

  getExtension(name: string): Extension {
    const extension = this.extensions.find(
      (extension) => extension.name === name,
    );
    if (!extension) {
      throw new Error(`Unknown extension ${name}`);
    }

    return extension;
  }

  loadWorkspaceSetupFile() {
    require(this.workspaceSetupFile.pathWithoutExts);
  }

  registerProperties(
    target: object,
    descriptors: PropertyDescriptorMap & ThisType<any>,
  ) {
    Object.keys(descriptors).forEach(function (propertyName) {
      const descriptor = descriptors[propertyName];

      // const oldDescriptor = Object.getOwnPropertyDescriptor(obj, propertyName);

      Object.defineProperty(target, propertyName, {
        ...descriptor,
        enumerable: true,
        configurable: true,
      });
    });
  }
}

export const sol = new Sol();
