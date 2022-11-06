import type babelTypes from '@babel/types';
import { inspect } from 'util';
import { Data } from './data';
import type { NodePath, Scope, TraverseOptions } from '@babel/traverse';
import { Wrapper } from './wrapper';

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

  get data(): Data {
    return Data.create(this.value);
  }

  get program(): Ast {
    if (!('program' in this.value)) {
      throw new Error('Node does not contain a program.');
    }

    const file = this.value as babelTypes.File;

    return Ast.create(file.program);
  }

  traverseNodes(
    opts: TraverseOptions,
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ): this {
    const traverse = require('@babel/traverse').default;

    traverse(
      this.value,
      opts,
      scope || this.scope || undefined,
      state,
      parentPath || this.parentPath || undefined,
    );

    return this;
  }

  extractNodes(type: string | Function): Data<Ast[]> {
    // Allow also builder functions as type (e.g. astTypes.Identifier)
    if (typeof type === 'function') {
      type = type.name.slice(0, 1).toUpperCase() + type.name.slice(1);
    }

    const matches: Ast[] = [];
    this.traverseNodes({
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
    value: babelTypes.Node | Ast,
    scope: Scope | null = null,
    parentPath: NodePath | null = null,
  ): Ast {
    if (value instanceof Ast) {
      return value;
    }

    return new Ast(value, scope, parentPath);
  }
}
