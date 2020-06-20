import { ClassWithText } from '../interfaces/base';
import { Constructor } from '../interfaces/util';
import { WithText } from './text';
import { WithVscode } from './vscode';
import { WithPrint } from './print';
import { WithFile } from './file';
import { WithCopy } from './copy';

export function WithAllText<T extends Constructor<ClassWithText>>(base: T) {
    const core = WithText(base);
    const tools = WithFile(WithCopy(WithVscode(WithPrint(core))));

    return tools;
}
