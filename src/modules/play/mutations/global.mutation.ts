/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import {
  getPlays,
  play,
  PlayFile,
  playFile,
  replay,
} from '../utils/play.utils';

export const globals = {
  play: {
    value: withHelp(
      play,
      `
Opens a given play file for interactive editing.

Usage:
> play('my-play')
    `,
    ),
  },
  playFile: {
    value: withHelp(
      playFile,
      `
Returns a PlayFile instance for the given path or file.

Usage:
${PlayFile.usageHelp}
      `,
    ),
  },
  plays: {
    get() {
      return withHelp(
        getPlays(),
        `
Returns available play files.

Usage:
> plays.map(p => p.file).filter(f => f.path.includes('play-')).forEach(f => f.delete())
      `,
      );
    },
  },
  replay: {
    value: withHelp(
      replay,
      `
Replays the given play file.

Usage:
> replay('my-play')    
`,
    ),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const play: Globals['play'];
  const playFile: Globals['playFile'];
  const plays: Globals['plays'];
  const replay: Globals['replay'];
}

mutateGlobals(definePropertiesMutation(globals));
