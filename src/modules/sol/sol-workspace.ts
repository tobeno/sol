import { Directory } from '../storage/directory';
import { File } from '../storage/file';
import { getLoadedSolExtensions } from './sol-extension';
import { logDebug, logError } from '../../utils/log';
import { getSol } from './sol';
import { getCwd } from '../../utils/env';
import dotenv from 'dotenv';

export class SolWorkspace {
  readonly dir: Directory;
  readonly packageDir: Directory;
  loaded = false;

  constructor(workspacePath: string, packagePath: string) {
    this.dir = Directory.create(workspacePath);
    this.packageDir = Directory.create(packagePath);
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

  get envFile(): File {
    return this.dir.file('.env');
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
    const extensions = getLoadedSolExtensions();

    contextFile.create();
    contextFile.text = `
/* eslint-disable */
// @ts-nocheck
    
import '${this.packageDir.relativePathFrom(this.generatedDir)}/src/setup';
${extensions
  .map((extension, index) =>
    `
import '${extension.setupFile.dir.relativePathFrom(this.generatedDir)}/${
      extension.setupFile.basenameWithoutExt
    }';`.trimStart(),
  )
  .join('\n')}
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

import { extension } from '${this.packageDir.relativePathFrom(
        this.dir,
      )}/modules/sol/extension';
      
// ToDo: Register your first extension
// extension('your-extension', __dirname).load();
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
      logDebug(`Loaded setup file at ${this.setupFile.path}`);
    } catch (e) {
      logError(e);
    }

    const envFile = this.envFile;
    if (envFile.exists) {
      try {
        dotenv.config({ path: envFile.path });
        logDebug(`Loaded environment variables from ${envFile.path}`);
      } catch (e) {
        logError(e);
      }
    }

    logDebug(`Loaded workspace at ${this.dir.path}`);
  }
}

export function getCurrentSolWorkspaceDir(): Directory {
  return Directory.create(`${getCwd()}/.sol`);
}

let currentSolWorkspace: SolWorkspace | null = null;

export function getCurrentSolWorkspace(): SolWorkspace {
  if (!currentSolWorkspace) {
    currentSolWorkspace = new SolWorkspace(
      getCurrentSolWorkspaceDir().path,
      getSol().packageDir.path,
    );
  }

  return currentSolWorkspace;
}

export function getSolUserWorkspaceDir(): Directory {
  return getSol().userDir;
}

let userWorkspace: SolWorkspace | null = null;

export function getSolUserWorkspace(): SolWorkspace {
  if (!userWorkspace) {
    userWorkspace = new SolWorkspace(
      getSolUserWorkspaceDir().path,
      getSol().packageDir.path,
    );
  }

  return userWorkspace;
}
