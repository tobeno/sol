import type { ApexOptions } from 'apexcharts';
import { ensureNonEmpty } from '../../../utils/core.utils';
import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { Text } from '../../../wrappers/text.wrapper';

export interface ChartOptions extends ApexOptions {
  name?: string;
  type?: NonNullable<ApexOptions['chart']>['type'] | 'barx' | 'bary';
  /**
   * Data for the chart (shortcut for specifying series)
   *
   * Input:
   * - [1, 4]
   * - [['category1', 1], ['category2', 4]]
   * - [{x: 'category1', y: 1}, {x: 'category2', y: 4}]
   * - { category1: 1, category2: 4 }
   * - { category1: { series1: 1, series2: 2 }, category2: { series1: 4, series2: 9 } }
   */
  data?:
    | number[]
    | [number | string, number][]
    | {
        x: number | string;
        y: number;
      }[]
    | {
        [category: string]: number;
      }
    | {
        [category: string]: { [series: string]: number };
      };
}

/**
 * Class for generating charts.
 */
export class Chart {
  static readonly usageHelp = `
> chart({ data: [1, 20, 5] }).html.browse()
> chart({ data: [['2019', 1], ['2020', 2], ['2021', 1]], type: 'barx' }).html.browse()
> chart({ data: [{ x: '2019', y: 1 }, { x: '2020', y: 3 }, { x: '2021', y: 2 }], type: 'line' }).html.browse()
  `.trim();

  private readonly options: ApexOptions;

  constructor(options: ChartOptions) {
    const { data, type, name, ...otherOptions } = options;

    const preparedOptions: ApexOptions & {
      chart: NonNullable<ApexOptions['chart']>;
      plotOptions: NonNullable<ApexOptions['plotOptions']>;
    } = {
      ...otherOptions,
      chart: {},
      plotOptions: {},
    };

    if (type === 'bar' || type === 'bary' || !type) {
      preparedOptions.chart.type = 'bar';
      preparedOptions.plotOptions.bar = {
        horizontal: true,
      };
    } else if (type === 'barx') {
      preparedOptions.chart.type = 'bar';
      preparedOptions.plotOptions.bar = {
        horizontal: false,
      };
    }

    preparedOptions.chart = {
      ...preparedOptions.chart,
      ...(otherOptions.chart || {}),
    };

    if (otherOptions.plotOptions) {
      (
        Object.entries(otherOptions.plotOptions) as [
          key: keyof ApexPlotOptions,
          value: any,
        ][]
      ).forEach(([key, value]) => {
        preparedOptions.plotOptions[key] = {
          ...(preparedOptions.plotOptions[key] || {}),
          ...value,
        };
      });
    }

    if (data) {
      let series: ApexAxisChartSeries;
      if (Array.isArray(data)) {
        // data: [1, 4] or [['category1', 1], ['category2', 4]] or [{x: 'category1', y: 1}, {x: 'category2', y: 4}]

        preparedOptions.xaxis = {
          type: 'category',
          ...(name
            ? {
                title: {
                  text: name,
                },
              }
            : {}),
          ...(otherOptions.xaxis || {}),
        };

        series = [
          {
            name: ensureNonEmpty(name),
            data: data.map((value, index): any => {
              if (Array.isArray(value)) {
                value = {
                  x: String(value[0]),
                  y: value[1] || 0,
                };
              } else if (typeof value === 'number') {
                value = {
                  x: String(index + 1),
                  y: value,
                };
              }

              return value;
            }),
          },
        ];
      } else {
        series = [];

        const dataEntries = Object.entries(data);
        if (dataEntries.length > 0) {
          const objectValues =
            dataEntries[0]![1] && typeof dataEntries[0]![1] === 'object';
          if (!objectValues) {
            series.push({
              name: ensureNonEmpty(name),
              data: [],
            });
          }

          Object.entries(data).forEach(([category, value]) => {
            if (objectValues) {
              // data: { category1: { series1: 1, series2: 2 }, category2: { series1: 4, series2: 9 }

              Object.entries(value).forEach(([currentName, currentValue]) => {
                let currentSerie = series.find(
                  (serie) => serie.name === currentName,
                );
                if (!currentSerie) {
                  currentSerie = {
                    name: currentName,
                    data: [],
                  };
                  series.push(currentSerie);
                }

                currentSerie.data.push({
                  x: category,
                  y: currentValue,
                } as any);
              });
            } else {
              // data: { category1: 1, category2: 4 }

              ensureNonEmpty(series[0]).data.push({
                x: category,
                y: value,
              } as any);
            }
          });
        }
      }

      preparedOptions.series = series;
    }

    this.options = preparedOptions;
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
    const result = new Chart(options);

    return withHelp(
      result,
      `
Chart visualization.

Usage:
${Chart.usageHelp}
    `,
    );
  }
}
