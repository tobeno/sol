// ToDo: Use proxy instead of this mess

import type shelljs from 'shelljs';
import { StorageItem } from '../modules/storage/storage-item';
import { Data } from '@sol/modules/data/data';

type Shelljs = typeof shelljs;
type ShelljsFn<FnName extends keyof Shelljs> = FnName extends 'exec' | 'exit'
  ? Shelljs[FnName]
  : Shelljs[FnName] extends (...args: any) => any
  ? (...args: Parameters<Shelljs[FnName]>) => Data
  : never;

function wrap<FnType extends (...args: any[]) => any>(
  makeFn: () => FnType,
  { rawOutput }: { rawOutput?: boolean } = {},
): FnType {
  let fn: FnType | null = null;

  return ((...args: any[]): any => {
    if (!fn) {
      fn = makeFn();
    }

    const result = fn(
      args.map((arg) => {
        if (arg instanceof StorageItem) {
          arg = arg.path;
        }

        return arg;
      }),
    );

    return rawOutput ? result : Data.create(result);
  }) as FnType;
}

export const cd = wrap<ShelljsFn<'cd'>>(() => require('shelljs').cd);
export const exec = wrap<ShelljsFn<'exec'>>(() => require('shelljs').exec, {
  rawOutput: true,
});
export const exit = wrap<ShelljsFn<'exit'>>(() => require('shelljs').exit, {
  rawOutput: true,
});
export const cp = wrap<ShelljsFn<'cp'>>(() => require('shelljs').cp);
export const cat = wrap<ShelljsFn<'cat'>>(() => require('shelljs').cat);
export const chmod = wrap<ShelljsFn<'chmod'>>(() => require('shelljs').chmod);
export const echo = wrap<ShelljsFn<'echo'>>(() => require('shelljs').echo);
export const which = wrap<ShelljsFn<'which'>>(() => require('shelljs').which);
export const ln = wrap<ShelljsFn<'ln'>>(() => require('shelljs').ln);
export const ls = wrap<ShelljsFn<'ls'>>(() => require('shelljs').ls);
export const touch = wrap<ShelljsFn<'touch'>>(() => require('shelljs').touch);
export const tail = wrap<ShelljsFn<'tail'>>(() => require('shelljs').tail);
export const head = wrap<ShelljsFn<'head'>>(() => require('shelljs').head);
export const sort = wrap<ShelljsFn<'sort'>>(() => require('shelljs').sort);
export const find = wrap<ShelljsFn<'find'>>(() => require('shelljs').find);
export const grep = wrap<ShelljsFn<'grep'>>(() => require('shelljs').grep);
export const mkdir = wrap<ShelljsFn<'mkdir'>>(() => require('shelljs').mkdir);
export const rm = wrap<ShelljsFn<'rm'>>(() => require('shelljs').rm);
export const mv = wrap<ShelljsFn<'mv'>>(() => require('shelljs').mv);
