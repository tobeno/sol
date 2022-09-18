import { loopWhile } from 'deasync';
import { logError } from './log';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export function deasync<FnType extends (...args: any[]) => Promise<any>>(
  fn: FnType,
): (...args: Parameters<FnType>) => ThenArg<ReturnType<FnType>> {
  return (...args: Parameters<FnType>) => {
    return awaitSync(fn(...args));
  };
}

export function sleep(seconds: number): void {
  let done = false;
  setTimeout(() => {
    done = true;
  }, seconds * 1000);

  loopWhile(() => !done);
}

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
