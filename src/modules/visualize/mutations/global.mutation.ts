/**
 * Mutation for the global scope.
 */

import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { withHelp } from '../../../utils/metadata';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import { Chart } from '../wrappers/chart';
import { Graph } from '../wrappers/graph';

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
