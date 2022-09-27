import { Directory } from '../storage/directory';
import { File } from '../storage/file';
import { getLoadedSolExtensions } from './sol-extension';
import { logDebug, logError } from '../../utils/log';
import { getCwd } from '../../utils/env';
import dotenv from 'dotenv';
import { homedir } from 'os';
import { getSolPackage } from './sol-package';

export class SolWorkspace {
  readonly dir: Directory;
  loaded = false;

  constructor(workspacePath: string) {
    this.dir = Directory.create(workspacePath);
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
    const solPackage = getSolPackage();

    contextFile.create();
    contextFile.text = `
/* eslint-disable */
// @ts-nocheck
    
import '${solPackage.dir.relativePathFrom(this.generatedDir)}/src/setup';
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
      const solPackage = getSolPackage();

      setupFile.create();
      setupFile.text = `
/* eslint-disable */
// @ts-nocheck

import { solExtension } from '${solPackage.dir.relativePathFrom(
        this.dir,
      )}/src/modules/sol/sol-extension';
      
// ToDo: Register your first extension
// solExtension('your-extension', __dirname).load();
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

let currentSolWorkspace: SolWorkspace | null = null;

export function getCurrentSolWorkspace(): SolWorkspace {
  if (!currentSolWorkspace) {
    currentSolWorkspace = new SolWorkspace(`${getCwd()}/.sol`);
  }

  return currentSolWorkspace;
}

let userWorkspace: SolWorkspace | null = null;

export function getSolUserWorkspace(): SolWorkspace {
  if (!userWorkspace) {
    userWorkspace = new SolWorkspace(`${homedir()}/.sol`);
  }

  return userWorkspace;
}
