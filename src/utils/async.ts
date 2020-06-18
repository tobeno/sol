import { loopWhile } from 'deasync';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export function deasync<FnType extends (...args: any[]) => Promise<any>>(
  fn: FnType,
): (...args: Parameters<FnType>) => ThenArg<ReturnType<FnType>> {
  return (...args: Parameters<FnType>) => {
    let result = undefined;
    let error = null;

    let pending = true;

    fn(...args)
      .then((r) => {
        result = r;

        pending = false;
      })
      .catch((e) => {
        pending = false;
        error = e;
      });

    loopWhile(() => pending);

    if (error) {
      throw error;
    }

    return result as any;
  };
}
