import { dir, Directory } from '../storage/directory';
import { File } from '../storage/file';
import { globals } from '../globals/globals';
import { getLoadedExtensions } from './extension';
import { logDebug, logError } from '../utils/log';
import { getSol } from './sol';
import { getCwd } from '../utils/env';

export class Workspace {
  readonly dir: Directory;
  readonly packageDir: Directory;
  loaded = false;

  constructor(workspacePath: string, packagePath: string) {
    this.dir = dir(workspacePath);
    this.packageDir = dir(packagePath);
  }

  get generatedDir(): Directory {
    return this.dir.dir('generated');
  }

  get contextFile(): File {
    return this.generatedDir.file('workspace-context.ts');
  }

  get setupFile(): File {
    return this.dir.file('setup.ts');
  }

  reload(): void {
    const workspaceDir = this.dir;

    const modules = workspaceDir
      .files('**/*.{js,ts}')
      .map((f) => f.pathWithoutExt);
    modules.forEach((module) => {
      delete require.cache[require.resolve(module)];
    });

    this.load();
  }

  updateContextFile(): void {
    const contextFile = this.contextFile;
    const extensions = getLoadedExtensions();

    contextFile.create();
    contextFile.text = `
/* eslint-disable */
// @ts-nocheck
    
import { Globals } from '${this.packageDir.relativePathFrom(
      this.generatedDir,
    )}/modules/globals/globals';
${extensions
  .map((extension, index) =>
    `
import { Globals as GlobalsFromExtension${index} } from '${extension.globalsFile.dir.relativePathFrom(
      this.generatedDir,
    )}/${extension.globalsFile.basenameWithoutExt}';`.trimStart(),
  )
  .join('\n')}

declare global {
${Object.keys(globals)
  .map((key) => `  const ${key}: Globals['${key}'];`)
  .join('\n')}
  
${extensions
  .map(
    (extension, index) =>
      `  // Extension: ${extension.name} (${extension.dir.path})
${Object.keys(extension.globals)
  .map((key) => `  const ${key}: GlobalsFromExtension${index}['${key}'];`)
  .join('\n')}`,
  )
  .join('\n\n')}
}
`.trimStart();
  }

  prepare(force = false): void {
    const workspaceDir = this.dir;
    workspaceDir.create();

    const gitignoreFile = workspaceDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    this.updateContextFile();

    const setupFile = this.setupFile;
    if (!setupFile.exists || force) {
      setupFile.create();
      setupFile.text = `
/* eslint-disable */
// @ts-nocheck

import './${this.contextFile.dir.relativePathFrom(this.dir)}/${
        this.contextFile.basenameWithoutExt
      }';
import { logDebug } from '${this.packageDir.relativePathFrom(
        this.dir,
      )}/modules/utils/log';
import { extension } from '${this.packageDir.relativePathFrom(
        this.dir,
      )}/modules/sol/extension';
      
// ToDo: Register your first extension
// extension('your-extension', __dirname).load();

logDebug('Loaded ' + __filename);
`.trimStart();
    }
  }

  load(): void {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    logDebug(`Loading workspace at ${this.dir.path}...`);

    this.prepare();

    try {
      require(this.setupFile.pathWithoutExt);
    } catch (e) {
      logError(e);
    }

    logDebug(`Loaded workspace at ${this.dir.path}`);
  }
}

export function getCurrentWorkspaceDir(): Directory {
  return dir(`${getCwd()}/.sol`);
}

let currentWorkspace: Workspace | null = null;

export function getCurrentWorkspace(): Workspace {
  if (!currentWorkspace) {
    currentWorkspace = new Workspace(
      getCurrentWorkspaceDir().path,
      getSol().packageDir.path,
    );
  }

  return currentWorkspace;
}

export function getUserWorkspaceDir(): Directory {
  return getSol().userDir;
}

let userWorkspace: Workspace | null = null;

export function getUserWorkspace(): Workspace {
  if (!userWorkspace) {
    userWorkspace = new Workspace(
      getUserWorkspaceDir().path,
      getSol().packageDir.path,
    );
  }

  return userWorkspace;
}
