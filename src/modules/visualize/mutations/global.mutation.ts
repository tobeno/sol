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
      `Wrapper for charts

Usage:
chart('')`,
    ),
  },
  graph: {
    value: withHelp(Graph.create, 'Wrapper for Mermaid graphs'),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const chart: Globals['chart'];
  const graph: Globals['graph'];
}

mutateGlobals(definePropertiesMutation(globals));
