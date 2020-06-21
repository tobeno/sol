import { homedir } from 'os';
import { REPLServer } from 'repl';
import { Directory, dir } from './storage/directory';
import { File, file } from './storage/file';
import { setupPlayContext } from './play';

export class Sol {
  server: REPLServer | null = null;
  globals = {};
  workspaceGlobals = {};
  extensions: Record<string, Directory> = {};
  loadedExtensionNames: string[] = [];

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

  get playDir(): Directory {
    return this.workspaceDir.dir('play');
  }

  get workspaceGlobalsFilePath(): string {
    return `${this.workspaceDir.path}/globals.ts`;
  }

  get playContextFile(): File {
    const playContextFile = this.workspaceDir.file('play-context.ts');

    setupPlayContext(playContextFile.path);

    return playContextFile;
  }

  get workspaceGlobalsFile(): File {
    return file(this.workspaceGlobalsFilePath);
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
      const exampleSetupFile = extensionsDir.file('workspace/setup.js');
      exampleSetupFile.create();

      exampleSetupFile.text = `
/**
 * Setup file for example extension
 */

 // Register global variables
sol.registerGlobals({
  example() {
    console.log('Hello from your extension!');
  },
});  

// Extend all strings
sol.registerProperties(String.prototype, {
  example: {
    value() {
      console.log('Hello from your extension!');
    }
  }
});
`.trimStart();
    }

    sol.registerDefaultExtensions();

    const globalsFile = this.workspaceGlobalsFile;
    if (!globalsFile.exists) {
      globalsFile.create();
      globalsFile.text = `
/**
 * Additional globals for the current workspace
 */ 
const workspaceGlobals = {
  workspace: {
    example() {
        console.log('Hello!');
    }
  }
};

sol.registerWorkspaceGlobals(workspaceGlobals);

type WorkspaceGlobals = typeof workspaceGlobals;

declare global {
  const workspace: typeof workspaceGlobals.workspace;

  namespace NodeJS {
    interface Global extends WorkspaceGlobals {}
  }
}     
`.trimStart();
    }

    const setupFile = this.workspaceSetupFile;
    if (!setupFile.exists) {
      setupFile.text = `
/**
 * Setup file for the current workspace
 * 
 * Typically you would load extensions here
 */ 

${this.extensionNames
  .map((name) => {
    return `// sol.loadExtension('${name}');`;
  })
  .join('\n')}

`.trimStart();
    }

    globalsFile.setupPlay(true);

    try {
      const setupFile = sol.workspaceGlobalsFile;
      setupFile.replay();
    } catch (e) {
      console.log(
        'Failed to load workspace globals.ts file.\n\nError: ' + e.message,
      );
    }

    this.loadWorkspaceSetupFile();
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

  registerWorkspaceGlobals(globals: any) {
    const globalGeneric = global as any;

    Object.assign(globalGeneric, globals);
    Object.assign(this.workspaceGlobals, globals);
  }

  registerDefaultExtensions() {
    this.registerExtensions(this.packageExtensionsDir.dirs());
    this.registerExtensions(this.globalExtensionsDir.dirs());
    this.registerExtensions(this.workspaceExtensionsDir.dirs());
  }

  registerExtension(nameOrPath: string | Directory): Directory {
    let extensionDir;
    if (typeof nameOrPath === 'string') {
      if (!nameOrPath.includes('/')) {
        extensionDir = this.packageExtensionsDir.dir(name);
      } else {
        extensionDir = dir(nameOrPath);
      }
    } else {
      extensionDir = nameOrPath;
    }

    this.extensions[extensionDir.name] = extensionDir;

    return extensionDir;
  }

  registerExtensions(extensions: Directory[]): Directory[] {
    return extensions.map((extensionDir) =>
      this.registerExtension(extensionDir),
    );
  }

  reloadExtension(name: string): Directory {
    const extensionDir = sol.getExtensionDir(name);

    const modules = extensionDir.files('**/*.js').map((f) => f.path);
    modules.forEach((module) => {
      delete require.cache[module];
    });

    return this.loadExtension(name, true);
  }

  reloadExtensions(names: string[]): Directory[] {
    return names.map((name) => this.reloadExtension(name));
  }

  loadExtension(name: string, force = false): Directory {
    const extensionDir = this.getExtensionDir(name);
    if (!force && this.loadedExtensionNames.includes(name)) {
      return extensionDir;
    }

    const setupFile = extensionDir.file('setup.js');
    if (!setupFile.exists) {
      throw new Error(
        `Extension ${name} (${extensionDir.path}) is missing setup.js file`,
      );
    }

    require(setupFile.pathWithoutExt);

    console.log(`Loaded extension ${name} (${extensionDir.path})`);

    this.server?.displayPrompt();

    if (!this.loadedExtensionNames.includes(name)) {
      this.loadedExtensionNames.push(name);
    }

    return extensionDir;
  }

  loadExtensions(names: string[]): Directory[] {
    return names.map((name) => this.loadExtension(name));
  }

  getExtensionDir(name: string) {
    if (!this.extensions[name]) {
      throw new Error(`Unknown extension ${name}`);
    }

    return this.extensions[name];
  }

  loadWorkspaceSetupFile() {
    require(this.workspaceSetupFile.pathWithoutExt);
  }

  registerProperties(
    obj: object,
    descriptors: PropertyDescriptorMap & ThisType<any>,
  ) {
    Object.keys(descriptors).forEach(function (propertyName) {
      const descriptor = descriptors[propertyName];

      // const oldDescriptor = Object.getOwnPropertyDescriptor(obj, propertyName);

      Object.defineProperty(obj, propertyName, {
        ...descriptor,
        enumerable: true,
        configurable: true,
      });
    });
  }
}

export const sol = new Sol();
