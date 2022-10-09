import { File } from '../storage/file';

const cache = new Map<string | symbol, any>();

export function runtimeCached<ResultType = any>(
  key: string | symbol,
  fn: () => ResultType,
): ResultType {
  if (!cache.has(key)) {
    const value = fn();
    cache.set(key, value);
    return value;
  }

  return cache.get(key);
}

export function fileCached<ResultType = any>(
  pathOrFile: string | File,
  fn: () => ResultType,
): ResultType {
  if (typeof pathOrFile === 'string' && !pathOrFile.match(/[/\\]/)) {
    pathOrFile = solWorkspace.cachedDir.file(pathOrFile);
  }

  const file = File.create(pathOrFile);

  if (!file.exists) {
    const result = fn();
    file.json = {
      data: result,
      createdAt: new Date().toISOString(),
    };

    return result;
  }

  return file.json.value.data;
}
