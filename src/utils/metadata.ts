export interface SolMetadata {
  help?: string;
}

export function withSolMetadata<T>(target: T, meta: SolMetadata): T {
  if (!target) {
    return target;
  }

  if (typeof (target as any).__solMeta__ === 'undefined') {
    Object.defineProperty(target, '__solMeta__', {
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
  if (target && typeof target.__solMeta__ !== 'undefined') {
    return target.__solMeta__;
  }

  return {};
}
