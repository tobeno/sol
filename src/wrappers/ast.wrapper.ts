import type { NodePath, Scope, TraverseOptions } from '@babel/traverse';
import type babelTypes from '@babel/types';
import { inspect } from 'util';
import { Data } from './data.wrapper';
import { Wrapper } from './wrapper.wrapper';

/**
 * Wrapper for a JavaScript / TypeScript AST (Abstract Syntax Tree) node.
 */
export class Ast<
  NodeType extends babelTypes.Node = babelTypes.Node,
> extends Wrapper<NodeType> {
  constructor(
    public value: NodeType,
    public scope: Scope | null = null,
    public parentPath: NodePath | null = null,
  ) {
    super(value);
  }

  /**
   * Returns the AST as wrapped data.
   */
  get data(): Data<NodeType> {
    return Data.create(this.value);
  }

  /**
   * Returns the node of this AST.
   */
  get node(): NodeType {
    return this.value;
  }

  /**
   * Returns an AST of the program of this AST.
   */
  get program(): Ast {
    if (!('program' in this.value)) {
      throw new Error('Node does not contain a program.');
    }

    const file = this.value as babelTypes.File;

    return Ast.create(file.program);
  }

  /**
   * Traverses the nodes of the AST.
   */
  traverse(
    opts: TraverseOptions,
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ): this;
  /**
   * Traverses the nodes of the AST.
   */
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

  /**
   * Returns all nodes filtered by the given callback.
   */
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

  /**
   * Returns the first node filtered by the given callback.
   */
  find(cb: (n: babelTypes.Node) => boolean): Ast | null {
    return this.filter(cb).value[0] || null;
  }

  /**
   * Returns the first node matching the given type.
   */
  select(type: string | Function): Ast | null {
    return this.selectAll(type).value[0] || null;
  }

  /**
   * Returns all nodes matching the given type.
   */
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
