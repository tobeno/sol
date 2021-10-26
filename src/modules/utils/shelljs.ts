import * as shelljs from 'shelljs';
import { Item } from '../storage/item';
import { wrapObject } from '../data/transformer';

function wrap<FnType extends (...args: any[]) => any>(fn: FnType): FnType {
  return ((...args: any[]): any => {
    return wrapObject(
      fn(
        args.map((arg) => {
          if (arg instanceof Item) {
            arg = arg.path;
          }

          return arg;
        }),
      ),
    );
  }) as FnType;
}

export const cd = wrap(shelljs.cd);
export const exec = shelljs.exec;
export const exit = shelljs.exit;
export const cp = wrap(shelljs.cp);
export const cat = wrap(shelljs.cat);
export const chmod = wrap(shelljs.chmod);
export const echo = wrap(shelljs.echo);
export const which = wrap(shelljs.which);
export const ln = wrap(shelljs.ln);
export const ls = wrap(shelljs.ls);
export const touch = wrap(shelljs.touch);
export const tail = wrap(shelljs.tail);
export const head = wrap(shelljs.head);
export const sort = wrap(shelljs.sort);
export const find = wrap(shelljs.find);
export const grep = wrap(shelljs.grep);
export const mkdir = wrap(shelljs.mkdir);
export const rm = wrap(shelljs.rm);
export const mv = wrap(shelljs.mv);
