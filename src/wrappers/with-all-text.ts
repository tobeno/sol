import { ClassWithText } from '../interfaces/base';
import { Constructor } from '../interfaces/util';
import { WithText } from './with-text';
import { WithEdit } from './with-edit';
import { WithPrint } from './with-print';
import { WithFile } from './with-file';
import { WithCopy } from './with-copy';

export function WithAllText<T extends Constructor<ClassWithText>>(base: T) {
  const core = WithText(base);
  const tools = WithFile(WithCopy(WithEdit(WithPrint(core))));

  return tools;
}
