import type babelTypes from '@babel/types';
import { inspect } from 'util';
import { Data } from './data';
import { astToCode } from '../transform/transformer';
import type { NodePath, Scope, TraverseOptions } from '@babel/traverse';
import { Text } from './text';
import { Wrapper } from '@sol/modules/data/wrapper';

/**
 * Wrapper for HTML strings
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

  get node(): babel.Node {
    return this.value;
  }

  get code(): Text {
    return astToCode(this);
  }

  traverseNodes(
    opts: TraverseOptions,
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ): this {
    require('@babel/traverse').traverse(
      this.value,
      opts,
      scope || this.scope || undefined,
      state,
      parentPath || this.parentPath || undefined,
    );

    return this;
  }

  extractNodes(type: string | Function): Data<Ast[]> {
    // Allow also builder functions as type (e.g. ast.Identifier)
    if (typeof type === 'function') {
      type = type.name.slice(0, 1).toUpperCase() + type.name.slice(1);
    }

    const matches: Ast[] = [];
    this.traverseNodes({
      [type]: (path: NodePath) => {
        matches.push(new Ast(path.node, path.scope, path));
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
