import { logDebug } from '../utils/log.utils';
import { getCurrentSolWorkspace, getSolUserWorkspace } from './sol-workspace';

/**
 * Initializes Sol globals and extensions.
 */
export function loadSol(): void {
  logDebug('Loading Sol...');

  const workspace = getCurrentSolWorkspace();
  const userWorkspace = getSolUserWorkspace();

  userWorkspace.load();
  workspace.load();

  // Update context files again
  userWorkspace.updateContextFile();
  workspace.updateContextFile();

  logDebug('Loaded Sol');
}
