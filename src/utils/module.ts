/**
 * Does a fresh require of the given module ID (without cache)
 */
export function rerequire(module: string): any {
  clearRequireCache([module]);

  return require(module);
}

export function clearRequireCache(modules: string[] | null = null): void {
  if (modules) {
    modules.forEach((module) => {
      delete require.cache[require.resolve(module)];
    });
  } else {
    Object.keys(require.cache).forEach((module) => {
      delete require.cache[module];
    });
  }
}
