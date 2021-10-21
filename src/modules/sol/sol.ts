import { homedir } from 'os';
import { REPLServer } from 'repl';
import { dir, Directory } from '../storage/directory';
import { File, file } from '../storage/file';
import { Extension } from './extension';
import { camelcaseText } from '../utils/text';
import { log } from '../utils/log';
import { isObjectPropertyDescriptor } from '../utils/object';

export class Sol {
  server: REPLServer | null = null;
  globals = {};
  extensions: Extension[] = [];
  workspaceDirPath: string;

  constructor() {
    this.workspaceDirPath = `${process.cwd()}/.sol`;
  }

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
    return this.runtimeDir.parent.parent;
  }

  get packageDistDir(): Directory {
    return this.packageDir.dir('dist/src');
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
    return dir(this.workspaceDirPath);
  }

  get workspaceExtensionsDir(): Directory {
    return this.workspaceDir.dir('extensions');
  }

  get workspaceExtensionDir(): Directory {
    return this.workspaceExtensionsDir.dir('workspace');
  }

  get workspaceExtension(): Extension {
    return this.getExtension(this.workspaceExtensionDir.name);
  }

  get workspaceGeneratedDir(): Directory {
    return this.workspaceDir.dir('generated');
  }

  get playDir(): Directory {
    return this.workspaceDir.dir('play');
  }

  get playContextFile(): File {
    return this.workspaceGeneratedDir.file('play-context.ts');
  }

  get workspaceContextFile(): File {
    return this.workspaceGeneratedDir.file('workspace-context.ts');
  }

  get workspaceSetupFile(): File {
    return this.workspaceDir.file('setup.ts');
  }

  reloadWorkspace() {
    const workspaceDir = this.workspaceDir;

    const modules = workspaceDir
      .files('**/*.{js,ts}')
      .map((f) => f.pathWithoutExt);
    modules.forEach((module) => {
      delete require.cache[require.resolve(module)];
    });

    this.loadWorkspace();
  }

  loadWorkspace() {
    const workspaceDir = this.workspaceDir;
    workspaceDir.create();

    const gitignoreFile = workspaceDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    const workspaceExtensionDir = this.workspaceExtensionDir;
    if (
      !workspaceExtensionDir.exists &&
      workspaceDir.path !== this.globalDir.path
    ) {
      workspaceExtensionDir.create();
      const workspaceExtension = new Extension(
        'workspace',
        workspaceExtensionDir,
      );
      workspaceExtension.generateGlobalsFile();
      workspaceExtension.generateSetupFile();
    }

    this.registerDefaultExtensions();

    const setupFile = this.workspaceSetupFile;
    if (!setupFile.exists) {
      this.generateWorkspaceSetupFile();

      this.updateWorkspace(); // Ensure generated files exist
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
        `Workspace in ${workspaceDir.path} already contains a setup.ts file`,
      );
    }

    workspaceSetupFile.create();

    workspaceSetupFile.text = `
// @ts-nocheck
/* eslint-disable */
/**
* Setup file for workspace
*/

import './${workspaceContextFile.dir.relativePathFrom(
      workspaceSetupFile.dir,
    )}/${workspaceContextFile.basenameWithoutExt}';

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
      extensions,
      packageDistDir,
      workspaceContextFile,
    } = this;

    workspaceGeneratedDir.create();

    const extensionsWithGlobals = extensions.filter(
      (extension) =>
        extension.globalsFile.exists &&
        extension.loaded &&
        Object.keys(extension.globals).length,
    );

    playContextFile.text = `
// @ts-nocheck
/* eslint-disable */
import './${workspaceContextFile.dir.relativePathFrom(playContextFile.dir)}/${
      workspaceContextFile.name
    }';
`.trimStart();

    workspaceContextFile.text = `
// @ts-nocheck
/* eslint-disable */
import { globals } from './${packageDistDir.relativePathFrom(
      workspaceContextFile.dir,
    )}/modules/globals/globals';
    
${extensionsWithGlobals
  .map((extension) =>
    `
import { globals as ${camelcaseText(
      extension.name,
    )}Globals } from './${extension.globalsFile.dir.relativePathFrom(
      workspaceContextFile.dir,
    )}/${extension.globalsFile.basenameWithoutExt}';
`.trimStart(),
  )
  .join('\n')}

export type Globals = {
${Object.keys(this.globals)
  .map((key) => {
    const value = (this.globals as any)[key];

    return `  ${key}: ${
      isObjectPropertyDescriptor(value) && 'get' in value
        ? `ReturnType<typeof globals.${key}.get>`
        : `typeof globals.${key}`
    },`;
  })
  .join('\n  ')}
${extensionsWithGlobals
  .map((extension) =>
    Object.keys(extension.globals)
      .map((key) => {
        const globalsVar = `${camelcaseText(extension.name)}Globals`;
        const value = (extension.globals as any)[key];

        return `  ${key}: ${
          isObjectPropertyDescriptor(value) && 'get' in value
            ? `ReturnType<typeof ${globalsVar}.${key}.get>`
            : `typeof ${globalsVar}.${key}`
        },`;
      })
      .join('\n'),
  )
  .join('\n')}
};

declare global {
  const {
${Object.keys(this.globals)
  .map((key) => `    ${key},`)
  .join('\n')}
${extensionsWithGlobals
  .map((extension) =>
    Object.keys(extension.globals)
      .map((key) => `    ${key},`)
      .join('\n'),
  )
  .join('\n')}
  }: Globals;

  namespace NodeJS {
    interface Global extends Globals {}
  }
}
`.trimStart();
  }

  playFile(path?: string): File {
    path = path || `play-${new Date().toISOString().replace(/[^0-9]/g, '')}`;

    if (!path.endsWith('.ts')) {
      path += '.ts';
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

  registerDefaultExtensions() {
    this.registerExtensions(this.packageExtensionsDir.dirs().value);
    this.registerExtensions(this.globalExtensionsDir.dirs().value);
    this.registerExtensions(this.workspaceExtensionsDir.dirs().value);
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
    try {
      require(this.workspaceSetupFile.pathWithoutExts);
    } catch (e) {
      log('Failed to load workspace setup file.', e);
    }
  }
}

export const sol = new Sol();
