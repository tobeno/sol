import * as babelTypes from '@babel/types';
import { inspect } from 'util';
import { Data } from './data';
import { astToCode } from './mapper';
import traverse, { TraverseOptions, Scope, NodePath } from '@babel/traverse';
import { Text } from './text';

/**
 * Wrapper for HTML strings
 */
export class Ast extends Data<babelTypes.Node> {
  constructor(public value: babelTypes.Node) {
    super(value);
  }

  get node(): babel.Node {
    return this.value;
  }

  get code(): Text {
    return astToCode(this);
  }

  traverse(
    opts: TraverseOptions,
    scope?: Scope,
    state?: any,
    parentPath?: NodePath,
  ): this {
    traverse(this.value, opts, scope, state, parentPath);

    return this;
  }

  extract(type: string | Function): Ast[] {
    // Allow also builder functions as type (e.g. ast.Identifier)
    if (typeof type === 'function') {
      type = type.name.slice(0, 1).toUpperCase() + type.name.slice(1);
    }

    const matches: Ast[] = [];
    this.traverse({
      [type]: (path: NodePath) => {
        matches.push(new Ast(path.node));
      },
    });

    return matches;
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return `Ast { ${this.code} }`;
  }

  toString() {
    return this.code;
  }
}

export * as astTypes from '@babel/types';
