import type babelTypes from '@babel/types';
import { inspect } from 'util';
import { Data } from './data';
import type { NodePath, Scope, TraverseOptions } from '@babel/traverse';
import { Wrapper } from './wrapper';
import { Text } from './text';
import { codeToAst } from '../transform/transformer';

/**
 * Wrapper for AST code trees
 */
export class Ast extends Wrapper<babelTypes.Node> {
  constructor(
    public value: babelTypes.Node,
    public scope: Scope | null = null,
    public parentPath: NodePath | null = null,
  ) {
    super(value);
  }

  get data(): Data<babelTypes.Node> {
    return Data.create(this.value);
  }

  get node(): babelTypes.Node {
    return this.value;
  }

  get program(): Ast {
    if (!('program' in this.value)) {
      throw new Error('Node does not contain a program.');
    }

    const file = this.value as babelTypes.File;

    return Ast.create(file.program);
  }

  traverse(
    opts: TraverseOptions,
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ): this;
  traverse(opts: (node: babelTypes.Node) => void): this;
  traverse(
    opts: TraverseOptions | ((node: babelTypes.Node) => void),
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ): this {
    const traverse = require('@babel/traverse').default;

    if (typeof opts === 'function') {
      traverse(this.value, {
        enter(path: NodePath) {
          opts(path.node);
        },
      });

      return this;
    }

    traverse(
      this.value,
      opts,
      scope || this.scope || undefined,
      state,
      parentPath || this.parentPath || undefined,
    );

    return this;
  }

  filter(cb: (n: babelTypes.Node) => boolean): Data<Ast[]> {
    const matches: Ast[] = [];
    this.traverse({
      enter: (path: NodePath) => {
        if (cb(path.node)) {
          matches.push(Ast.create(path.node, path.scope, path));
        }
      },
    });

    return Data.create(matches);
  }

  find(cb: (n: babelTypes.Node) => boolean): Ast | null {
    return this.filter(cb).value[0] || null;
  }

  select(type: string | Function): Ast | null {
    return this.selectAll(type).value[0] || null;
  }

  selectAll(type: string | Function): Data<Ast[]> {
    // Allow also builder functions as type (e.g. astTypes.Identifier)
    if (typeof type === 'function') {
      type = type.name.slice(0, 1).toUpperCase() + type.name.slice(1);
    }

    const matches: Ast[] = [];
    this.traverse({
      [type]: (path: NodePath) => {
        matches.push(Ast.create(path.node, path.scope, path));
      },
    });

    return Data.create(matches);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    return `Ast { ${this.code} }`;
  }

  toString(): string {
    return this.code.value;
  }

  static create(
    value: string | Text | babelTypes.Node | Ast,
    scope: Scope | null = null,
    parentPath: NodePath | null = null,
  ): Ast {
    if (value instanceof Ast) {
      return value;
    }

    if (typeof value === 'string' || value instanceof Text) {
      return codeToAst(value);
    }

    return new Ast(value, scope, parentPath);
  }
}
