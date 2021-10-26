/**
 * Does a fresh require of the given module ID (without cache)
 */
export function rerequire(id: string) {
  clearRequireCache(id);

  return require(id);
}

export function clearRequireCache(id: string) {
  delete require.cache[require.resolve(id)];
}
