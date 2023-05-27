import { Data } from '../wrappers/data';
import { File } from '../wrappers/file';

export interface LoadedModule {
  file: File;
  size: number;
}

export function getLoadedModules(): Data<LoadedModule[]> {
  return Data.create(Object.keys(require.cache)).map((m) => {
    const file = File.create(m);

    return {
      file,
      size: file.size,
    };
  });
}

export function getLoadedNodeModules(): Data<LoadedModule[]> {
  return getLoadedModules().filter((module) =>
    module.file.path.includes('node_modules/'),
  );
}

export function getLoadedUserModules(): Data<LoadedModule[]> {
  return getLoadedModules().filter(
    (module) => !module.file.path.includes('node_modules/'),
  );
}
