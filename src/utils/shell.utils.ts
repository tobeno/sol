import { execSync, spawn as spawnInternal } from 'child_process';
import { Text } from '../wrappers/text.wrapper';

function convertShellStringToText(result: string): Text {
  result = String(result);
  return Text.create(result.endsWith('\n') ? result.slice(0, -1) : result);
}

export function execCommand(
  command: string,
  options: {
    cwd?: string;
  } = {},
): Text {
  const output = execSync(command, {
    cwd: options.cwd || process.cwd(),
    encoding: 'utf8',
  });

  return convertShellStringToText(output);
}

export function spawnCommand(
  command: string,
  args: string[],
  options: {
    cwd?: string;
  },
) {
  return spawnInternal(command, args, {
    cwd: options.cwd || process.cwd(),
  });
}
