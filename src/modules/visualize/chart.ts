import type { ApexOptions } from 'apexcharts';
import { Text } from '../data/text';
import { DataFormat } from '../data/data-format';
import { ArrayItemType } from '../../interfaces/util';

type ChartSeries = Exclude<
  ArrayItemType<NonNullable<ApexOptions['series']>>,
  number
>;

export interface ChartOptions extends ApexOptions {
  name?: string;
  type?: NonNullable<ApexOptions['chart']>['type'];
  color?: string;
  data?:
    | ChartSeries['data']
    | {
        [category: string]: number;
      };
}

/**
 * Class for generating charts.
 */
export class Chart {
  private readonly options: ApexOptions;

  constructor(options: ChartOptions) {
    const { data, type, color, name, ...otherOptions } = options;

    this.options = {
      ...otherOptions,
      chart: {
        type: type || 'bar',
        ...(otherOptions.chart || {}),
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
        ...(otherOptions.plotOptions || {}),
      },
      ...(data
        ? {
            series: [
              {
                name,
                color,
                data: !Array.isArray(data)
                  ? Object.entries(data).map(([category, value]) => ({
                      x: category,
                      y: value,
                    }))
                  : data,
              },
            ],
            xaxis: {
              type: 'category',
              ...(name
                ? {
                    title: {
                      text: name,
                    },
                  }
                : {}),
              ...(otherOptions.xaxis || {}),
            },
          }
        : {}),
    };
  }

  /**
   * Returns the HTML of the chart.
   */
  get html(): Text {
    return Text.create(
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <style>
      body {
        margin: 0;
      }
    
      #chart {
        width: calc(100vw - 20px);
        height: calc(100vh - 20px);
        margin: 10px;
      }
    </style>
  </head>
  <body>
    <div id="chart"></div>
    <script>
      const options = ${JSON.stringify(this.options, null, 2)};
      const chart = new ApexCharts(document.querySelector('#chart'), options);
      chart.render();
    </script>
  </body>
</html>`,
      DataFormat.Html,
    );
  }

  static create(options: ChartOptions): Chart {
    return new Chart(options);
  }
}
