import { dir, Directory } from '../storage/directory';
import { File } from '../storage/file';
import { globals } from '../globals/globals';

export class Workspace {
  readonly dir: Directory;
  readonly packageDistDir: Directory;

  constructor(workspacePath: string, packageDistPath: string) {
    this.dir = dir(workspacePath);
    this.packageDistDir = dir(packageDistPath);
  }

  get historyFile(): File {
    return this.dir.file('history');
  }

  get generatedDir(): Directory {
    return this.dir.dir('generated');
  }

  get contextFile(): File {
    return this.generatedDir.file('context.ts');
  }

  reload() {
    const workspaceDir = this.dir;

    const modules = workspaceDir
      .files('**/*.{js,ts}')
      .map((f) => f.pathWithoutExt);
    modules.forEach((module) => {
      delete require.cache[require.resolve(module)];
    });

    this.load();
  }

  load() {
    const workspaceDir = this.dir;
    workspaceDir.create();

    const gitignoreFile = workspaceDir.file('.gitignore');
    if (!gitignoreFile.exists) {
      gitignoreFile.text = '*';
    }

    const contextFile = this.contextFile;
    contextFile.create();
    contextFile.text = `
import { Globals } from '${this.packageDistDir.relativePathFrom(
      this.generatedDir,
    )}/modules/globals/globals';

declare global {
${Object.keys(globals)
  .map((key) => `  const ${key}: Globals['${key}'];`)
  .join('\n')}
}
`.trimStart();
  }
}
