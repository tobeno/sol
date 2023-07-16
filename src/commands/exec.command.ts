import { Command } from 'commander';
import * as vm from 'vm';

export function execCommand(): Command {
  return new Command('exec')
    .description('Executed the given command')
    .argument(
      '<command>',
      'Command to run (e.g. `text("test").uppercased` to uppercase "test")',
    )
    .action(async (command: string) => {
      // Use VM to execute command in a sandbox
      const output = vm.runInThisContext(command);

      // Write output to stdout
      log(output);
    });
}
