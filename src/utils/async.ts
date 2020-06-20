import { loopWhile } from 'deasync';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export function deasync<FnType extends (...args: any[]) => Promise<any>>(
  fn: FnType,
): (...args: Parameters<FnType>) => ThenArg<ReturnType<FnType>> {
  return (...args: Parameters<FnType>) => {
    return awaitSync(fn(...args));
  };
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
