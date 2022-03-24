/**
 * Does a fresh require of the given module ID (without cache)
 */
export function rerequire(module: string) {
  clearRequireCache([module]);

  return require(module);
}

export function clearRequireCache(modules: string[] | null = null) {
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
