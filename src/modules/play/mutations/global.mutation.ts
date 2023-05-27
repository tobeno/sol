/**
 * Mutation for the global scope.
 */

import { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { getPlays, play, playFile, replay } from '../utils/play.utils';

export const globals = {
  play: withHelp(
    {
      value: play,
    },
    'Opens a given play file for interactive editing',
  ),
  playFile: withHelp(
    {
      value: playFile,
    },
    'Returns a PlayFile instance for the given path or file',
  ),
  plays: withHelp(
    {
      get() {
        return getPlays();
      },
    },
    'Returns available play files',
  ),
  replay: withHelp(
    {
      value: replay,
    },
    'Replays the given play file',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const play: Globals['play'];
  const playFile: Globals['playFile'];
  const plays: Globals['plays'];
  const replay: Globals['replay'];
}

mutateGlobals(definePropertiesMutation(globals));
