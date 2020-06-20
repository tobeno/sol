import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import { Item } from './item';
import { Directory } from './directory';
import { WithJson } from '../extensions/json';
import { WithPrint } from '../extensions/print';
import { WithCopy } from '../extensions/copy';
import { WithAst } from '../extensions/ast';
import { WithData } from '../extensions/data';
import { WithCsv } from '../extensions/csv';
import { WithText } from '../extensions/text';
import { WithReplaceText } from '../extensions/replace';
import { WithYaml } from '../extensions/yaml';

class UnwrappedFile extends Item {
    constructor(path: string) {
        super(path);
    }

    get ext(): string {
        const { basename: name } = this;
        const pos = name.lastIndexOf('.');
        if (pos <= 0) {
            return '';
        }

        return name.slice(pos + 1);
    }

    get name(): string {
        const { basename: name } = this;
        const pos = name.lastIndexOf('.');
        if (pos <= 0) {
            return name;
        }

        return name.slice(0, pos);
    }

    get dir(): Directory {
        return new Directory(path.dirname(this.path));
    }

    get text(): string {
        return fs.readFileSync(this.path, 'utf8');
    }

    set text(value: string) {
        fs.writeFileSync(this.path, value, 'utf8');
    }

    get length() {
        return this.text.length;
    }

    get size() {
        return this.stats.size;
    }

    create() {
        if (this.exists) {
            return;
        }

        const dir = this.dir;
        if (!dir.exists) {
            dir.create();
        }

        this.text = '';
    }

    delete() {
        fs.unlinkSync(this.path);
    }

    moveTo(newPath: string) {
        fs.renameSync(this.path, newPath);

        this.path = newPath;
    }

    copyTo(newPath: string) {
        fs.copyFileSync(this.path, newPath);

        this.path = newPath;
    }

    serve() {
        this.dir.serve();
    }

    watch(fn: (eventType: string, filename: string) => any): () => void {
        const watcher = fs.watch(
            this.path,
            {
                encoding: 'utf8'
            },
            fn
        );

        return () => {
            watcher.close();
        };
    }

    pretty() {
        this.text = prettier.format(this.text, {
            filepath: this.path
        });
    }
}

export class File extends WithReplaceText(
    WithAst(WithYaml(WithCsv(WithJson(WithText(WithData(WithCopy(WithPrint(UnwrappedFile))))))))
) {}

export function file(path: string): File {
    return new File(path);
}
