/**
 * Mutation for the global scope.
 */

import { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { Chart } from '../wrappers/chart.wrapper';
import { Graph } from '../wrappers/graph.wrapper';

export const globals = {
  chart: withHelp(
    {
      value: Chart.create,
    },
    'See https://apexcharts.com/docs/series/',
  ),
  graph: withHelp(
    {
      value: Graph.create,
    },
    'Wrapper for Mermaid graphs',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const chart: Globals['chart'];
  const graph: Globals['graph'];
}

mutateGlobals(definePropertiesMutation(globals));
