import { readFileSync } from 'fs';
import path from 'path';
import type { Project, SourceFile } from 'ts-morph';
import { File } from '../wrappers/file';
import { log } from './log';

export interface MorphOptions {
  dryRun?: boolean;
  projectPath?: string;
  aliasImportStrategy?: 'prefer-absolute' | 'prefer-short' | 'prefer-relative';
  normalizeImports?: boolean;
}

export interface MorphContext {
  projectPath: string;
  dryRun: boolean;
}

function getRelativeModuleSpecifier(
  absoluteModule: string,
  file: SourceFile,
): string {
  let relativeModule = path.relative(file.getDirectoryPath(), absoluteModule);
  if (!relativeModule.startsWith('.')) {
    relativeModule = `./${relativeModule}`;
  }

  return relativeModule;
}

function resolveModuleSpecifier(
  module: string,
  file: SourceFile,
  moduleAliasMap: [string, string][],
): string {
  const moduleAliasMapEntry = moduleAliasMap.find(([key]) =>
    module.startsWith(key),
  );

  if (moduleAliasMapEntry) {
    const [alias, aliasPath] = moduleAliasMapEntry;
    const moduleWithoutAlias = module.slice(alias.length);
    const resolvedModule = path.resolve(`${aliasPath}${moduleWithoutAlias}`);

    return getRelativeModuleSpecifier(resolvedModule, file);
  }

  return module;
}

export function getProject(projectPath: string) {
  // Lazy load for performance
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  const { Project } = require('ts-morph') as typeof import('ts-morph');
  let tsConfigFilePath = [
    path.join(projectPath, `tsconfig.json`),
    path.join(projectPath, `tsconfig.app.json`),
    path.join(projectPath, `tsconfig.build.json`),
  ].find(
    (possibleTsConfigFilePath) => File.create(possibleTsConfigFilePath).exists,
  );

  if (!tsConfigFilePath) {
    throw new Error(`tsconfig.json not found in ${projectPath}.`);
  }

  const project = new Project({
    tsConfigFilePath,
  });

  return project;
}

function getModuleAliasMapForProject(
  project: Project,
  projectPath: string,
): [string, string][] {
  const tsConfig = project.getCompilerOptions();
  const tsConfigPathsEntries = Object.entries(tsConfig.paths || {});
  if (
    !tsConfigPathsEntries.every(
      ([key, value]) =>
        key.endsWith('*') && value.length === 1 && value[0].endsWith('*'),
    )
  ) {
    throw new Error(
      'tsconfig.json paths must be of the form "key/*": ["value/*"]',
    );
  }

  /**
   * Map of prefixes (e.g. { '@common' })
   */
  const moduleAliasMap: [string, string][] = tsConfigPathsEntries.map(
    ([key, value]) => [
      key.slice(0, -1),
      path.resolve(
        projectPath,
        tsConfig.baseUrl || '.',
        value[0].slice(0, -1),
      ) + path.sep,
    ],
  );

  return moduleAliasMap;
}

function unresolveModuleSpecifier(
  module: string,
  file: SourceFile,
  moduleAliasMap: [string, string][],
  options: MorphOptions = {},
): string {
  if (!module.match(/^[./]/)) {
    return module;
  }

  // Ignore some modules that cannot use aliases
  if (module.endsWith('src/cli/setup')) {
    return module;
  }

  const absoluteModule = path.resolve(file.getDirectoryPath(), module);
  const relativeModule = getRelativeModuleSpecifier(absoluteModule, file);

  const moduleAliasMapEntry = moduleAliasMap.find(([_, value]) =>
    absoluteModule.startsWith(value),
  );
  if (moduleAliasMapEntry) {
    const [alias, aliasPath] = moduleAliasMapEntry;
    const moduleWithoutAliasPath = absoluteModule.slice(aliasPath.length);
    const resolvedModule = `${alias}${moduleWithoutAliasPath}`;

    // Within an alias namespace, use relative imports
    if (
      file.getFilePath().startsWith(aliasPath) &&
      options.aliasImportStrategy === 'prefer-short'
    ) {
      return relativeModule;
    }

    return resolvedModule;
  }

  return module;
}

function mapProjectModuleSpecifiers(
  project: Project,
  mapModuleFn: (module: string, file: SourceFile) => string,
): void {
  // Lazy load for performance
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  const { ts } = require('ts-morph') as typeof import('ts-morph');

  project.getSourceFiles().forEach((file: SourceFile) => {
    file.getImportDeclarations().forEach((declaration) => {
      const module = declaration.getModuleSpecifier().getLiteralValue();

      const resolvedModule = mapModuleFn(module, file);

      if (module !== resolvedModule) {
        declaration.setModuleSpecifier(resolvedModule);
      }
    });

    file.getDescendantsOfKind(ts.SyntaxKind.ImportKeyword).forEach((node) => {
      const parent = node.getParentIfKind(ts.SyntaxKind.CallExpression);
      if (!parent) {
        return;
      }

      const moduleLiteral = parent
        .getArguments()[0]
        .asKind(ts.SyntaxKind.StringLiteral);
      if (!moduleLiteral) {
        return;
      }

      const module = moduleLiteral.getLiteralValue();
      const resolvedModule = mapModuleFn(module, file);

      if (module !== resolvedModule) {
        moduleLiteral.setLiteralValue(resolvedModule);
      }
    });

    file
      .getDescendantsOfKind(ts.SyntaxKind.Identifier)
      .filter((node) => node.getText() === 'require')
      .forEach((node) => {
        const parent = node.getParentIfKind(ts.SyntaxKind.CallExpression);
        if (!parent) {
          return;
        }

        const moduleLiteral = parent
          .getArguments()[0]
          .asKind(ts.SyntaxKind.StringLiteral);
        if (!moduleLiteral) {
          return;
        }

        const module = moduleLiteral.getLiteralValue();
        const resolvedModule = mapModuleFn(module, file);

        if (module !== resolvedModule) {
          moduleLiteral.setLiteralValue(resolvedModule);
        }
      });
  });
}

function unaliasProject(
  project: Project,
  moduleAliasMap: [string, string][],
  importSpecifierMapByFiles: Record<string, Record<string, string>>,
): void {
  mapProjectModuleSpecifiers(project, (module, file) => {
    const newModule = resolveModuleSpecifier(module, file, moduleAliasMap);
    const filePath = file.getFilePath();
    let importSpecifierMap: Record<string, string> =
      importSpecifierMapByFiles[filePath];
    if (!importSpecifierMap) {
      importSpecifierMap = {};
      importSpecifierMapByFiles[filePath] = importSpecifierMap;
    }

    importSpecifierMap[newModule] = module;

    return newModule;
  });
}

function aliasProject(
  project: Project,
  moduleAliasMap: [string, string][],
  importSpecifierMapByFiles: Record<string, Record<string, string>>,
  options: MorphOptions = {},
): void {
  mapProjectModuleSpecifiers(project, (module, file) => {
    const filePath = file.getFilePath();
    const importSpecifierMap = importSpecifierMapByFiles[filePath] || {};

    return (
      importSpecifierMap[module] ||
      unresolveModuleSpecifier(module, file, moduleAliasMap, options)
    );
  });
}

/**
 * Morphs a project using the given morphFn
 *
 * Important: This will automatically clean up the projects aliases.
 * To avoid mixing this with the actual morph, best use normalizeProjectModuleAliases beforehand.
 */
export function morphProject(
  morphFn: (project: Project, context: MorphContext) => void,
  options: MorphOptions = {},
): void {
  const projectPath = options.projectPath || process.cwd();
  const project = getProject(projectPath);
  const dryRun = options.dryRun || false;

  const moduleAliasMap = getModuleAliasMapForProject(project, projectPath);

  const hasModuleAliases = moduleAliasMap.length > 0;

  // Remove module aliases as not supported by ts-morph
  const importSpecifierMapByFiles: Record<string, Record<string, string>> = {};
  if (hasModuleAliases) {
    unaliasProject(project, moduleAliasMap, importSpecifierMapByFiles);
  }

  morphFn(project, {
    projectPath,
    dryRun,
  });

  // Readd aliases
  if (hasModuleAliases && options.aliasImportStrategy !== 'prefer-relative') {
    aliasProject(
      project,
      moduleAliasMap,
      options.normalizeImports ? {} : importSpecifierMapByFiles,
      options,
    );
  }

  const unsavedSourceFiles = project
    .getSourceFiles()
    .filter((file: SourceFile) => {
      let oldContents: string | null;
      try {
        oldContents = readFileSync(file.getFilePath(), 'utf8');
      } catch (e) {
        oldContents = null;
      }

      // Do actual diff as some files might have changed back to their original state
      return file.getFullText() !== oldContents;
    });

  if (unsavedSourceFiles.length > 0) {
    log(
      `Changed ${unsavedSourceFiles.length} files:\n${unsavedSourceFiles
        .map((file: SourceFile) => file.getFilePath())
        .join('\n')}\n`,
    );

    if (!dryRun) {
      project.saveSync();

      log('Saved changes');
    } else {
      log('Dry run, changes not saved');
    }
  } else {
    log('No changes');
  }
}

/**
 * Cleans up the module aliases (e.g. tsconfig.json paths) in a project
 */
export function normalizeProjectModuleAliases(
  options: MorphOptions = {},
): void {
  morphProject(() => {}, options);
}
