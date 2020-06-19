import { parse as babelParse } from '@babel/parser';
import * as babelTypes from '@babel/types';
import traverse, { TraverseOptions, Scope, NodePath } from '@babel/traverse';
import { inspect } from 'util';
import { parse as recastParse, print as recastPrint } from 'recast';
import { WithAllText } from '../extensions/all-text';
import { WithJson } from '../extensions/json';

export class UnwrappedAst {
  data: babelTypes.File;

  constructor(data: string | babelTypes.File) {
    if (typeof data === 'string') {
      data = UnwrappedAst.parse(data);
    }

    this.data = data;
  }

  get program() {
    return this.data.program;
  }

  get text(): string {
    return JSON.stringify(this.data, null, 2);
  }

  set text(value: string) {
    this.data = JSON.parse(value);
  }

  get code() {
    return UnwrappedAst.stringify(this.data);
  }

  set code(value: string) {
    this.data = UnwrappedAst.parse(value);
  }

  traverse(
    opts: TraverseOptions,
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ) {
    traverse(this.data, opts, scope, state, parentPath);

    return this;
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.data;
  }

  toString() {
    return this.text;
  }

  static parse(code: string): babelTypes.File {
    return recastParse(code, {
      parser: {
        parse(code: string) {
          return babelParse(code, {
            sourceType: 'module',
            plugins: ['typescript'],
          });
        },
      },
    });
  }

  static stringify(ast: babelTypes.File): string {
    return recastPrint(ast).code;
  }
}

export class Ast extends WithJson(WithAllText(UnwrappedAst)) {}

export * as astTypes from '@babel/types';

export function ast(...args: ConstructorParameters<typeof Ast>) {
  return new Ast(...args);
}
