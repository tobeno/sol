import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { getHelp } from '../utils/metadata.utils';

export function prepareSolCommand(cmd: string): string {
  let preparedCmd = cmd.trim();

  // Strip trailing semicolon
  if (preparedCmd.endsWith(';')) {
    preparedCmd = preparedCmd.slice(0, -1);
  }

  // Handle top-level await
  if (preparedCmd.includes('await')) {
    preparedCmd = `(async() => (${preparedCmd}))()`;
  }

  try {
    // Parse command to AST
    const cmdRootNode = parse(preparedCmd, {
      plugins: ['typescript'],
    });

    let traverseFn: (typeof import('@babel/traverse'))['default'] = traverse;
    if ('default' in traverseFn) {
      traverseFn = traverseFn.default as any;
    }

    let generateFn: (typeof import('@babel/generator'))['default'] = generate;
    if ('default' in generateFn) {
      generateFn = generateFn.default as any;
    }

    // Replace something.await with await something
    traverseFn(cmdRootNode, {
      Identifier(path) {
        if (
          path.node.name === 'await' &&
          path.parent &&
          path.parent.type === 'MemberExpression'
        ) {
          const memberExpressionNode = path.parent;
          const objectNode = memberExpressionNode.object;

          path.parentPath.replaceWith(t.awaitExpression(objectNode));
        } else if (
          path.node.name === 'help' &&
          path.parent &&
          path.parent.type === 'MemberExpression'
        ) {
          const memberExpressionNode = path.parent;
          const objectNode = memberExpressionNode.object;

          path.parentPath.replaceWith(
            t.callExpression(t.identifier('printHelp'), [objectNode]),
          );
        }
      },
    });

    // Regenerate command
    preparedCmd = generateFn(cmdRootNode, {}).code;
  } catch (e) {
    console.log(e);
    // Ignore babel errors and let the VM handle it
  }

  // Strip trailing semicolon
  if (preparedCmd.endsWith(';')) {
    preparedCmd = preparedCmd.slice(0, -1);
  }

  return preparedCmd;
}
