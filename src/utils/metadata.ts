export interface SolMetadata {
  help?: string;
}

export const SOL_METADATA_SYMBOL = Symbol('solMetadata');

export function withSolMetadata<T>(target: T, meta: SolMetadata): T {
  if (!target) {
    return target;
  }

  if (typeof (target as any)[SOL_METADATA_SYMBOL] === 'undefined') {
    Object.defineProperty(target, SOL_METADATA_SYMBOL, {
      enumerable: false,
      value: meta,
    });
  } else {
    const oldMeta = getSolMetadata(target);
    Object.assign(oldMeta, meta);
  }

  return target;
}

export function withHelp<T>(target: T, help: string): T {
  return withSolMetadata(target, {
    help,
  });
}

export function getSolMetadata(target: any): SolMetadata {
  if (target && typeof target[SOL_METADATA_SYMBOL] !== 'undefined') {
    return target[SOL_METADATA_SYMBOL];
  }

  return {};
}
