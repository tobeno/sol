import { readSync, writeSync } from 'clipboardy';
import {
  wrapString,
  unwrapString,
  jsonToData,
  yamlToData,
  csvToData,
} from '../data/mapper';
import { File } from '../storage/file';
import { saveAs } from '../storage/save';

export class Clipboard {
  get text(): any {
    return wrapString(readSync(), null, this);
  }

  set text(value: any) {
    writeSync(unwrapString(value));
  }

  get json(): any {
    return jsonToData(this.text);
  }

  get yaml(): any {
    return yamlToData(this.text);
  }

  get csv(): any {
    return csvToData(this.text);
  }

  print() {
    console.log(String(this));
  }

  saveAs(path: string): File {
    return saveAs(this, path);
  }
}

export const clipboard = new Clipboard();
