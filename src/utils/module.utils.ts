/**
 * Does a fresh require of the given module ID (without cache)
 */
export async function reimport<ModuleType>(
  module: string,
): Promise<ModuleType> {
  const cacheBustingModulePath = `${module}?update=${Date.now()}`;
  return import(cacheBustingModulePath);
}
