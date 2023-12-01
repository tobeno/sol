import { logDebug } from '../utils/log.utils';
import { getCurrentSolWorkspace, getSolUserWorkspace } from './sol-workspace';

/**
 * Initializes Sol globals and extensions.
 */
export async function loadSol(): Promise<void> {
  logDebug('Loading Sol...');

  const workspace = getCurrentSolWorkspace();
  const userWorkspace = getSolUserWorkspace();

  await userWorkspace.load();
  await workspace.load();

  // Update context files again
  userWorkspace.updateContextFile();
  workspace.updateContextFile();

  logDebug('Loaded Sol');
}
