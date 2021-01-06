/**
 * Does a fresh require of the given module ID (without cache)
 */
export function rerequire(id: string) {
  delete require.cache[require.resolve(id)];

  return require(id);
}
