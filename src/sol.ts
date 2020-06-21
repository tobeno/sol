import { homedir } from 'os';
import { REPLServer } from 'repl';
import { Directory, dir } from './storage/directory';
import { File, file } from './storage/file';
import { setupPlayContext } from './play';

export class Sol {
  server: REPLServer | null = null;
  globals = {};
  localGlobals = {};
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
    const globalDir = dir(`${homedir()}/.sol`);
    globalDir.create();

    return globalDir;
  }

  get globalExtensionsDir(): Directory {
    return this.globalDir.dir('extensions');
  }

  get historyFile(): File {
    const historyFile = this.globalDir.file('history');
    historyFile.create();

    return historyFile;
  }

  get localDir(): Directory {
    const localDir = dir('.sol');
    localDir.create();

    const gitignoreFile = localDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    return localDir;
  }

  get localExtensionsDir(): Directory {
    return this.localDir.dir('extensions');
  }

  get playDir(): Directory {
    const playDir = this.localDir.dir('play');
    playDir.create();

    return playDir;
  }

  get localGlobalsFilePath(): string {
    return `${this.localDir.path}/globals.ts`;
  }

  get playContextFile(): File {
    const playContextFile = this.localDir.file('play-context.ts');

    setupPlayContext(playContextFile.path);

    return playContextFile;
  }

  get localGlobalsFile(): File {
    const setupFile = file(this.localGlobalsFilePath);

    if (!setupFile.exists) {
      setupFile.create();
      setupFile.text = `
/**
 * Additional globals for the current workspace
 */ 
const localGlobals = {
  local: {
    example() {
        console.log('Hello!');
    }
  }
};

sol.registerLocalGlobals(localGlobals);

type LocalGlobals = typeof localGlobals;

declare global {
  const local: typeof localGlobals.local;

  namespace NodeJS {
    interface Global extends LocalGlobals {}
  }
}     
`.trimStart();
    }

    setupFile.setupPlay(true);

    return setupFile;
  }

  get localSetupFile(): File {
    const localSetupFile = this.localDir.file('setup.js');
    if (!localSetupFile.exists) {
      localSetupFile.text = `
/**
 * Setup file for the current workspace
 * 
 * Typically you would load extensions here
 */ 

${this.extensionNames
  .map((name) => {
    return `sol.loadExtension('${name}');`;
  })
  .join('\n')}

`.trimStart();
    }

    return localSetupFile;
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

  registerGlobals(globals: any) {
    const globalGeneric = global as any;

    Object.assign(globalGeneric, globals);
    Object.assign(this.globals, globals);
  }

  registerLocalGlobals(globals: any) {
    const globalGeneric = global as any;

    Object.assign(globalGeneric, globals);
    Object.assign(this.localGlobals, globals);
  }

  registerDefaultExtensions() {
    this.registerExtensions(this.packageExtensionsDir.dirs());
    this.registerExtensions(this.globalExtensionsDir.dirs());
    this.registerExtensions(this.localExtensionsDir.dirs());
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

    const registerFile = extensionDir.file('register.js');
    if (!registerFile.exists) {
      throw new Error(
        `Extension ${name} (${extensionDir.path}) is missing register.js file`,
      );
    }

    require(registerFile.pathWithoutExt);

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

  loadLocalSetupFile() {
    require(this.localSetupFile.pathWithoutExt);
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
