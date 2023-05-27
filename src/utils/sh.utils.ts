import { spawn as spawnInternal } from 'child_process';
import type shelljs from 'shelljs';
import { Data } from '../wrappers/data.wrapper';
import { StorageItem } from '../wrappers/storage-item.wrapper';
import { Text } from '../wrappers/text.wrapper';

type Shelljs = typeof shelljs;

type WrappedShelljsFnReturn<
  FnNameType extends keyof Shelljs,
  ReturnType,
> = ReturnType extends void
  ? void
  : FnNameType extends 'ls' | 'find'
  ? Data<string[]>
  : ReturnType extends string
  ? Text
  : ReturnType;
type WrappedShelljsFn<
  FnNameType extends keyof Shelljs,
  ShelljsFnType,
> = ShelljsFnType extends (...args: any) => any
  ? (
      ...args: Parameters<ShelljsFnType>
    ) => WrappedShelljsFnReturn<FnNameType, ReturnType<ShelljsFnType>>
  : never;

function wrapShelljsFn<FnNameType extends keyof Shelljs>(
  fnName: FnNameType,
): WrappedShelljsFn<FnNameType, Shelljs[FnNameType]> {
  let fn: (...args: any) => any;

  return ((...args: any[]): any => {
    if (!fn) {
      fn = require('shelljs')[fnName];
    }

    let result = fn(
      ...args.map((arg) => {
        if (arg instanceof StorageItem) {
          arg = arg.path;
        }

        return arg;
      }),
    );

    if (['ls', 'find'].includes(fnName)) {
      result = Data.create(result.map((item: string) => item));
    } else if (result instanceof String) {
      result = String(result);
      result = Text.create(
        result.endsWith('\n') ? result.slice(0, -1) : result,
      );
    } else {
      console.log('Unknown result', result);
    }

    return result;
  }) as any;
}

const execInternal = wrapShelljsFn('exec') as any;

export const cd = wrapShelljsFn('cd');
export const exec = (...args: Parameters<typeof execInternal>): Text => {
  return execInternal(args[0], {
    silent: true,
    ...(args[1] || {}),
  });
};
export const spawn = spawnInternal;
export const exit = wrapShelljsFn('exit');
export const cp = wrapShelljsFn('cp');
export const cat = wrapShelljsFn('cat');
export const chmod = wrapShelljsFn('chmod');
export const echo = wrapShelljsFn('echo');
export const which = wrapShelljsFn('which');
export const ln = wrapShelljsFn('ln');
export const ls = wrapShelljsFn('ls');
export const grep = wrapShelljsFn('grep');
export const find = wrapShelljsFn('find');
export const touch = wrapShelljsFn('touch');
export const tail = wrapShelljsFn('tail');
export const head = wrapShelljsFn('head');
export const sort = wrapShelljsFn('sort');
export const mkdir = wrapShelljsFn('mkdir');
export const rm = wrapShelljsFn('rm');
export const mv = wrapShelljsFn('mv');
