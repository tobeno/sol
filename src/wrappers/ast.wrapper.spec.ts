import * as babelTypes from '@babel/types';
import { codeToAst } from '../modules/transform';
import { Ast } from './ast.wrapper';
import { Data } from './data.wrapper';

describe('Ast', () => {
  describe('create', () => {
    it('should create an AST from a node', () => {
      const node = babelTypes.identifier('foo');
      const ast = Ast.create(node);

      expect(ast.node).toBe(node);
    });
  });

  describe('traverse', () => {
    it('should traverse the nodes of the AST', () => {
      const ast = codeToAst('console.log("test")');

      const nodeTypes: string[] = [];

      ast.program.traverse((node) => {
        nodeTypes.push(node.type);
      });

      expect(nodeTypes).toMatchSnapshot();
    });

    it('should traverse all identifiers of the AST', () => {
      const ast = codeToAst('console.log("test")');

      const identifiers: string[] = [];

      ast.program.traverse({
        Identifier(path) {
          identifiers.push(path.node.name);
        },
      });

      expect(identifiers).toEqual(['console', 'log']);
    });
  });

  describe('select', () => {
    it('should select the first identifier', async () => {
      const ast = codeToAst('console.log("test")');

      const node = ast.select(babelTypes.identifier)
        ?.node as babelTypes.Identifier;

      expect(node.name).toBe('console');
    });

    it('should select all identifiers', async () => {
      const ast = codeToAst('console.log("test")');

      const identifiers = ast.selectAll(babelTypes.identifier) as Data<
        Ast<babelTypes.Identifier>[]
      >;

      expect(
        identifiers.map((identifier) => identifier.node.name).value,
      ).toEqual(['console', 'log']);
    });
  });

  describe('filter', () => {
    it('should filter the nodes', async () => {
      const ast = codeToAst('console.log("test")');

      const identifiers = ast.filter(
        (node) => node.type === 'Identifier',
      ) as Data<Ast<babelTypes.Identifier>[]>;

      expect(
        identifiers.map((identifier) => identifier.node.name).value,
      ).toEqual(['console', 'log']);
    });
  });

  describe('find', () => {
    it('should find the first matching node', async () => {
      const ast = codeToAst('console.log("test")');

      const identifier = ast.find(
        (node) => node.type === 'Identifier',
      ) as Ast<babelTypes.Identifier>;

      expect(identifier.value.name).toBe('console');
    });

    it('should return null if nothing was found', async () => {
      const ast = codeToAst('console.log("test")');

      const nothing = ast.find(
        (node) => node.type === 'ArrayExpression',
      ) as Ast<babelTypes.Identifier>;

      expect(nothing).toBe(null);
    });
  });
});
