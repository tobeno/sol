/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { Chart } from '../wrappers/chart.wrapper';
import { Graph } from '../wrappers/graph.wrapper';

export const globals = {
  chart: {
    value: withHelp(
      Chart.create,
      `
Creates a new Chart to visualize data as chart.

Usage:
${Chart.usageHelp}
`,
    ),
  },
  graph: {
    value: withHelp(
      Graph.create,
      `
Wrapper for Mermaid graphs.

Usage:
${Graph.usageHelp}
`,
    ),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const chart: Globals['chart'];
  const graph: Globals['graph'];
}

mutateGlobals(definePropertiesMutation(globals));
