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
    const { data, type, name, ...otherOptions } = options;

    const preparedOptions: ApexOptions = {
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
    };

    if (data) {
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

      let series: ApexAxisChartSeries;
      if (Array.isArray(data)) {
        series = [
          {
            name,
            data,
          },
        ];
      } else {
        series = [];

        const dataEntries = Object.entries(data);
        const objectValues =
          dataEntries[0][1] && typeof dataEntries[0][1] === 'object';
        if (!objectValues) {
          series.push({
            name,
            data: [],
          });
        }

        Object.entries(data).forEach(([category, value]) => {
          if (objectValues) {
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
            series[0].data.push({
              x: category,
              y: value,
            } as any);
          }
        });
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
    return new Chart(options);
  }
}
