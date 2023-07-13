import { logError } from './log.utils';

export function catchAsyncErrors<T>(
  promise: T | PromiseLike<T>,
  onError: ((e: Error | any) => void) | null = null,
): void {
  Promise.resolve(promise).catch((e) => {
    if (onError) {
      onError(e);
    } else {
      logError(e);
    }
  });
}
