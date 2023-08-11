import { Command } from 'commander';

export function playCommand(): Command {
  return new Command('play')
    .description('Runs a test')
    .argument('<script>', 'Script to run')
    .action(async (scriptName: string) => {
      await playFile(scriptName).replay();
    });
}
