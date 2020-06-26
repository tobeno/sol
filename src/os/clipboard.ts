import { readSync, writeSync } from 'clipboardy';
import { WithSave } from '../wrappers/with-save';
import { WithPrint } from '../wrappers/with-print';
import {
  wrapString,
  unwrapString,
  jsonToData,
  yamlToData,
  csvToData,
} from '../data/mapper';

export class UnwrappedClipboard {
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
}

export class Clipboard extends WithSave(WithPrint(UnwrappedClipboard)) {}

export const clipboard = new Clipboard();
