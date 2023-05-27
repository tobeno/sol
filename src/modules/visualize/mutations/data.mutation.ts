import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../../wrappers/data';
import { Chart, ChartOptions } from '../wrappers/chart';

declare module '../../../wrappers/data' {
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
