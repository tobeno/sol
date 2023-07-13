import { loopWhile } from 'deasync';
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

export function awaitSync<T>(promise: T | PromiseLike<T>): T {
  let done = false;
  let data: T | undefined = undefined;
  let error = undefined;

  Promise.resolve(promise)
    .then((d: any) => {
      data = d;
      done = true;
    })
    .catch((e: any) => {
      error = e;
      done = true;
    });

  loopWhile(() => !done);

  if (error) {
    throw error;
  }

  return data as any;
}
