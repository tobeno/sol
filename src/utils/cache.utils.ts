import { getCurrentSolWorkspace } from '../sol/sol-workspace';
import { File } from '../wrappers/file.wrapper';
import { Wrapper } from '../wrappers/wrapper.wrapper';

const cache = new Map<string | symbol, any>();

/**
 * Cache the result of the given function using the given key in a runtime (variable) cache.
 */
export async function runtimeCached<ResultType = any>(
  key: string | symbol,
  fn: () => ResultType | Promise<ResultType>,
): Promise<ResultType> {
  if (!cache.has(key)) {
    const value = await fn();
    cache.set(key, value);
    return value;
  }

  return cache.get(key);
}

/**
 * Cache the result of the given function using the given key in a runtime (variable) cache.
 */
export async function fileCached<ResultType = any>(
  pathOrFile: string | File,
  fn: () => ResultType | Promise<ResultType>,
): Promise<ResultType> {
  if (typeof pathOrFile === 'string' && !pathOrFile.match(/[/\\]/)) {
    pathOrFile = getCurrentSolWorkspace().cacheDir.file(pathOrFile);
  }

  const file = File.create(pathOrFile);
  file.dir.create();

  if (!file.exists) {
    const result = await fn();
    if (result instanceof Wrapper) {
      throw new Error('Cannot cache a wrapper instance.');
    }

    file.json = {
      data: result,
      createdAt: new Date().toISOString(),
    };
  }

  return file.json.value.data;
}
