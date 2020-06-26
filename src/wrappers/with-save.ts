import { Constructor } from '../interfaces/util';
import { file, File } from '../storage/file';
import { tmp } from '../storage/tmp';
import { Text } from '../data/text';

export function WithSave<T extends Constructor>(base: T) {
  return class Wrapped extends base {
    save(): File {
      const thisGeneric = this as any;

      let file = null;
      let text = null;
      const textGeneric = thisGeneric.text;
      if (textGeneric instanceof Text) {
        text = textGeneric;
      }

      if (!text) {
        throw new Error('Could not convert to text');
      }

      const rootSource = thisGeneric.rootSource;
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

    saveAs(path: string): File {
      const f = file(path);
      f.text = this;
      return f;
    }
  };
}
