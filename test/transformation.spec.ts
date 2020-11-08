import * as tmp from 'tmp';
import { file } from '../src/storage/file';

import { readFileSync } from 'fs';
import { wrapObject } from '../src/data/mapper';

describe('transformation', () => {
  it('should transform a JSON file', async () => {
    const data = file(`${__dirname}/assets/products.json`).json;
    const obj = data.value;

    expect(obj).toHaveProperty('products');

    obj.variants = Array.from(
      wrapObject(obj.products).transform('variants').value,
    );

    const tmpFile = tmp.fileSync();
    data.json.saveAs(tmpFile.name);
    expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
    tmpFile.removeCallback();

    const tmpFile2 = tmp.fileSync();
    data.transform('variants').csv.saveAs(tmpFile2.name);
    expect(readFileSync(tmpFile2.name, 'utf-8')).toMatchSnapshot();
    tmpFile2.removeCallback();
  });

  it('should transform a YAML file', async () => {
    const data = file(`${__dirname}/assets/products.yaml`).yaml;
    const obj = data.value;

    expect(obj).toHaveProperty('products');

    const tmpFile = tmp.fileSync();
    data.yaml.saveAs(tmpFile.name);
    expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
    tmpFile.removeCallback();
  });

  it('should transform a CSV file', async () => {
    let data = file(`${__dirname}/assets/variants.csv`).csv;

    data = data.sort((a, b) => a.quantity - b.quantity);

    const tmpFile = tmp.fileSync();
    data.csv.saveAs(tmpFile.name);
    expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
    tmpFile.removeCallback();
  });
});
