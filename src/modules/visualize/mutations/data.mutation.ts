import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Chart, ChartOptions } from '../chart';

declare module '../../data/data' {
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
