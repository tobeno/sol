import { Command } from 'commander';
import { execCommand } from './commands/exec.command';
import { pipeCommand } from './commands/pipe.command';
import { playCommand } from './commands/play.command';
import { upgradeCommand } from './commands/upgrade.command';

export async function runCli(args: string[]): Promise<void> {
  const program = new Command();

  program.addCommand(execCommand());
  program.addCommand(pipeCommand());
  program.addCommand(playCommand());
  program.addCommand(upgradeCommand());

  await program.parseAsync(args, {
    from: 'user',
  });
}
