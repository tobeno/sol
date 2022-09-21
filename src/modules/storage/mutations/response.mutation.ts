import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../file';
import { save, saveAs } from '../save';
import { Response } from '../../web/response';

declare module '../../web/response' {
  interface Response {
    saveAs(path: string): File;

    save(): File;
  }
}

mutateClass(
  Response,
  definePropertiesMutation({
    saveAs: {
      value(path: string): File {
        return saveAs(this.json, path);
      },
    },

    save: {
      value(): File {
        return save(this.json);
      },
    },
  }),
);
