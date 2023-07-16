import { Command } from 'commander';
import { playCommand } from './commands/play.command';
import { upgradeCommand } from './commands/upgrade.command';

export async function runCli(args: string[]): Promise<void> {
  const program = new Command();

  program.addCommand(playCommand());
  program.addCommand(upgradeCommand());

  await program.parseAsync(args, {
    from: 'user',
  });
}
