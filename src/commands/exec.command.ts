import { Command } from 'commander';
import * as vm from 'vm';
import { prepareSolCommand } from '../sol/sol-command';

export function execCommand(): Command {
  return new Command('exec')
    .description('Executed the given command')
    .argument(
      '<command>',
      'Command to run (e.g. `text("test").uppercased` to uppercase "test")',
    )
    .action(async (command: string) => {
      const preparedCommand = prepareSolCommand(command);

      // Use VM to execute command in a sandbox
      const output = await vm.runInThisContext(preparedCommand);

      // Write output to stdout
      log(output);
    });
}
