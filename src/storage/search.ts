import { File } from './file';
import { ItemCollection } from './item-collection';
import { exec } from 'shelljs';



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

export async function replaceText(
  pattern: string | RegExp,
  replacer: any,
  path?: string,
): Promise<ItemCollection<File>> {
  const files = grep(pattern, path);

  Promise.all(
    files.map((file) => {
      file.replaceText(pattern, replacer);
    }),
  );

  return files;
}
