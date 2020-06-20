import { File, file } from '../storage/file';
import { tmp } from '../storage/tmp';
import { globals } from '../globals';
import { sol } from '../sol';

export function vscode(pathOrValue?: any): File {
  let f: File;

  if (!pathOrValue) {
    f = tmp('ts');
  } else if (typeof pathOrValue === 'object') {
    if (
      pathOrValue.constructor !== Object &&
      typeof pathOrValue.data !== 'undefined'
    ) {
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
    const playDir = sol.localDir.dir('play');
    playDir.create();

    const gitignore = playDir.file('.gitignore');
    if (!gitignore.exists) {
      gitignore.text = '*';
    }

    path = `${playDir.path}/play-${new Date()
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
