import { File } from './file';
import { tmp } from './tmp';
import { Text } from '../data/text';

export function save(content: any): File {
  let file = null;
  let text: Text | null = null;
  const textGeneric = content.text;
  if (textGeneric instanceof Text) {
    text = textGeneric;
  }

  if (!text) {
    throw new Error('Could not convert to text');
  }

  const rootSource = content.rootSource;
  if (rootSource) {
    if (rootSource instanceof File) {
      file = rootSource;
    } else {
      throw new Error('Source does not support saving');
    }
  }

  if (!file) {
    file = tmp(text.ext);
  }

  file.text = text;

  return file;
}

export function saveAs(content: any, path: string): File {
  const f = File.create(path);
  f.text = content;
  return f;
}
