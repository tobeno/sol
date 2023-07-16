import { Command } from 'commander';
import { updateSol } from '../sol/sol-server';

export function upgradeCommand(): Command {
  return new Command('upgrade')
    .description('Upgrades the project')
    .action(() => {
      updateSol();
    });
}
