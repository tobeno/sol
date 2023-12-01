import dotenv from 'dotenv';
import { homedir } from 'os';
import path from 'path';
import { getCwd } from '../utils/env.utils';
import { logDebug, logError } from '../utils/log.utils';
import { Directory } from '../wrappers/directory.wrapper';
import { File } from '../wrappers/file.wrapper';
import { getLoadedSolExtensions } from './sol-extension';
import { getSolPackage } from './sol-package';

/**
 * Class for interacting with a Sol workspace directors.
 */
export class SolWorkspace {
  readonly dir: Directory;
  loaded = false;

  constructor(workspacePath: string) {
    this.dir = Directory.create(workspacePath);
  }

  /**
   * Generated directory of the workspace.
   */
  get generatedDir(): Directory {
    return this.dir.dir('generated');
  }

  /**
   * Cache directory of the workspace.
   */
  get cacheDir(): Directory {
    return this.dir.dir('cache');
  }

  /**
   * Context file of the workspace.
   */
  get contextFile(): File {
    return this.generatedDir.file('workspace-context.ts');
  }

  /**
   * Setup file of the workspace.
   */
  get setupFile(): File {
    return this.dir.file('setup.ts');
  }

  /**
   * Setup file of the workspace.
   */
  get packageFile(): File {
    return this.dir.file('package.json');
  }

  /**
   * .env file of the workspace.
   */
  get envFile(): File {
    return this.dir.file('.env');
  }

  /**
   * Updates the context file of the workspace.
   */
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
    this.cacheDir.create();
    this.generatedDir.create();

    const gitignoreFile = workspaceDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    this.updateContextFile();

    const setupFile = this.setupFile;

    // Delete old JS file is exists
    const setupJsFile = File.create(setupFile.pathWithoutExt + '.js');
    if (setupJsFile.exists) {
      setupJsFile.delete();
    }

    if (!setupFile.exists || force) {
      const solPackage = getSolPackage();

      setupFile.create();
      setupFile.text = `
/* eslint-disable */
// @ts-nocheck

import { solExtension } from '${solPackage.dir.relativePathFrom(
        this.dir,
      )}/src/sol/sol-extension';
      
// ToDo: Register your first extension
// solExtension('your-extension', __dirname).load();
`.trimStart();
    }

    const packageFile = this.packageFile;

    if (!packageFile.exists || force) {
      packageFile.create();
      packageFile.text = `
{
  "type": "module"
}
`.trimStart();
    }
  }

  /**
   * Loads the workspace as well as its setup.ts and .env file.
   */
  async load(): Promise<void> {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    logDebug(`Loading workspace at ${this.dir.path}...`);

    this.prepare();

    try {
      await import(this.setupFile.pathWithoutExt);
      logDebug(`Loaded setup file at ${this.setupFile.path}`);
    } catch (e) {
      this.setupFile.delete();

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

/**
 * Returns the Sol workspace for the current working directory.
 */
export function getCurrentSolWorkspace(): SolWorkspace {
  if (!currentSolWorkspace) {
    currentSolWorkspace = new SolWorkspace(path.join(getCwd(), '.sol'));
  }

  return currentSolWorkspace;
}

let userWorkspace: SolWorkspace | null = null;

/**
 * Returns the Sol workspace for the current user (home directory).
 */
export function getSolUserWorkspace(): SolWorkspace {
  if (!userWorkspace) {
    userWorkspace = new SolWorkspace(path.join(homedir(), '.sol'));
  }

  return userWorkspace;
}
