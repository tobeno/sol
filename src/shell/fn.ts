import { log } from '../log';
import { File } from '../storage/file';
import { tmp, file, dir } from '../storage/fn';
import { globals } from '../globals';
import * as shelljs from 'shelljs';
import { Item } from '../storage/item';

export function cwd() {
  return process.cwd();
}

export function lost() {
  log(cwd());
}

export function rebuild() {
  shelljs.exec(`pushd ${__dirname}/..;npm run build;popd`);
}

export function vscode(pathOrValue?: any): File {
  let f: File;

  if (!pathOrValue) {
    f = tmp('ts');
  } else if (typeof pathOrValue === 'object') {
    if(pathOrValue.constructor !== Object && typeof pathOrValue.data !== 'undefined') {
      pathOrValue = pathOrValue.data;
    }

    f = tmp('json');
    f.data = pathOrValue;
  } else if (
    typeof pathOrValue === 'string' &&
    /(^\s|\n|\s$)/.test(pathOrValue)
  ) {
    f = tmp('txt');
    f.text = pathOrValue;
  } else {
    f = file(pathOrValue);
  }

  f.create();

  if (!f.text) {
    f.text = `// --- SETUP ---\n/* eslint-disable */\nimport { globals } from '${__dirname}/globals';\nconst { ${Object.keys(
      globals,
    ).join(', ')} } = globals;\n// @ts-ignore\nconst used = [ ${Object.keys(
      globals,
    ).join(
      ', ',
    )} ];\n// @ts-ignore\nconst shared = global as any;\n// --- END SETUP ---\n\n`;
  }

  f.vscode();

  return f;
}

export function play(path?: string) {
  if (!path) {
    const playDir = dir('.sol/play');
    playDir.create();

    const gitignore = file('.sol/play/.gitignore');
    if (!gitignore.exists) {
      gitignore.text = '*';
    }

    path = `.sol/play/play-${new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')}.ts`;
  }

  const f = vscode(path);

  f.watch((event) => {
    if (event === 'change') {
      let source = f.text;

      source = source.replace(/[\s\S]+--- END SETUP ---/, '');

      eval(`const shared = {};\n${source}\nObject.assign(global, shared);`);
    }
  });

  return f;
}

function wrap<FnType extends (...args: any[]) => any>(fn: FnType): FnType {
  return ((...args: any[]): any => {
    return fn(
      args.map((arg) => {
        if (arg instanceof Item) {
          arg = arg.path;
        }

        return arg;
      }),
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
