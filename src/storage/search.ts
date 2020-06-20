import { File } from './file';
import { ItemCollection } from './item-collection';
import { exec } from 'shelljs';
import { awaitPromiseSync } from '../utils/async';



export function grep(
  pattern: string | RegExp,
  path?: string,
): ItemCollection<File> {
  return new ItemCollection<File>(
    ...exec(
      `egrep -rl '${(pattern instanceof RegExp ? pattern.source : pattern)
        .replace(/'/g, "\\'")
        .replace('\n', '\\n')}' ${path || '.'} || true`,
    )
      .split('\n')
      .filter((file) => !!file)
      .map((file) => new File(file)),
  );
}

export function replaceText(
  pattern: string | RegExp,
  replacer: any,
  path?: string,
): ItemCollection<File> {
  const files = grep(pattern, path);

  awaitPromiseSync(Promise.all(
    files.map((file) => {
      file.replaceText(pattern, replacer);
    }),
  ));

  return files;
}
