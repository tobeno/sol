import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { Chart, ChartOptions } from '../wrappers/chart.wrapper';

declare module '../../../wrappers/data.wrapper' {
  interface Data {
    /**
     * Creates a new chart from this data.
     */
    chart(options: ChartOptions): Chart;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    chart: {
      value(options: ChartOptions): Chart {
        return Chart.create({
          ...options,
          data: this.value as any,
        });
      },
    },
  }),
);
