import { Command } from 'commander';
import * as vm from 'vm';
import { readTextStream } from '../utils/stream.utils';
import { Text } from '../wrappers/text.wrapper';

export function pipeCommand(): Command {
  return new Command('pipe')
    .description('Uses Sol to pipe input through a given command')
    .argument(
      '<command>',
      'Command to run (e.g. ".json.yaml" to convert JSON to YAML)',
    )
    .action(async (command: string) => {
      // Read full text input from stdin
      const input = Text.create(await readTextStream(process.stdin));
      if (!command.startsWith('.')) {
        throw new Error('Command must start with a dot (e.g. ".json.yaml").');
      }

      // Build full command (by passing input)
      const fullCommand = `input${command}`;

      // Use VM to execute command in a sandbox
      const output = vm.runInNewContext(fullCommand, { input });

      // Write output to stdout
      log(output);
    });
}
