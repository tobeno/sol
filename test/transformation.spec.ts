import * as tmp from 'tmp';
import { file } from '../src/modules/storage/file';

import { readFileSync } from 'fs';
import { wrapObject, wrapString } from '../src/modules/data/transformer';

interface ProductVariant {
  id: string;
  size?: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  variants: ProductVariant[];
}

interface ProductsFile {
  products: Product[];
}

describe('transformation', () => {
  describe('file', () => {
    it('should transform a JSON file', async () => {
      const data = file<ProductsFile>(`${__dirname}/assets/products.json`).json;
      const obj = data.value;

      expect(obj).toHaveProperty('products');

      (obj as any).variants = Array.from(
        wrapObject(obj.products).extract('variants').value,
      );

      const tmpFile = tmp.fileSync();
      data.json.saveAs(tmpFile.name);
      expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
      tmpFile.removeCallback();

      const tmpFile2 = tmp.fileSync();
      data.extract('variants').csv.saveAs(tmpFile2.name);
      expect(readFileSync(tmpFile2.name, 'utf-8')).toMatchSnapshot();
      tmpFile2.removeCallback();
    });

    it('should transform a YAML file', async () => {
      const data = file<ProductsFile>(`${__dirname}/assets/products.yaml`).yaml;
      const obj = data.value;

      expect(obj).toHaveProperty('products');

      const tmpFile = tmp.fileSync();
      data.yaml.saveAs(tmpFile.name);
      expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
      tmpFile.removeCallback();
    });

    it('should transform a CSV file', async () => {
      let data = file<ProductVariant[]>(`${__dirname}/assets/variants.csv`).csv;

      data = data.sort((a, b) => a.quantity - b.quantity);

      const tmpFile = tmp.fileSync();
      data.csv.saveAs(tmpFile.name);
      expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
      tmpFile.removeCallback();
    });
  });

  describe('object', () => {
    it('should transform an array', async () => {
      let data = wrapObject([{ id: '1' }, { id: '2' }] as { id: string }[]);

      const originalData = data;

      expect(data.json.value).toMatchSnapshot();

      const filteredData = data.filter((item) => item.id === '1');

      const mappedData = filteredData.map((item) => item.id);

      expect(mappedData.value).toEqual(['1']);

      expect(mappedData.source).toBe(filteredData);
      expect(mappedData.rootSource).toBe(originalData);
    });

    it('should transform an object', async () => {
      let data = wrapObject({
        'product-1': { name: 'Shoe' },
        'product-2': { name: 'Shirt' },
      } as Record<string, { name: string }>);

      const originalData = data;

      expect(data.json.value).toMatchSnapshot();

      const filteredData = data.filter((item) => item.name === 'Shoe');

      const mappedData = filteredData.map((item) => item.name);

      expect(mappedData.value).toEqual({ 'product-1': 'Shoe' });

      expect(mappedData.source).toBe(filteredData);
      expect(mappedData.rootSource).toBe(originalData);
    });

    it('should transform a string', async () => {
      let text = wrapString(
        'Product 1: Shoe\nProduct 2: Shirt\nProduct 3: Jeans',
      );

      const originalText = text;

      let data = text.lines
        .map((line) => {
          const match = line.match(/Product (\d+): (.+)/);
          if (!match) {
            return null;
          }

          return { id: match[0], name: match[1] };
        })
        .filter((item) => !!item)
        .map((item) => JSON.stringify(item));

      const mappedLines = data;

      text = data.join('.');

      expect(text.value).toMatchSnapshot();

      expect(text.source).toBe(mappedLines);
      expect(text.rootSource).toBe(originalText);
    });
  });
});
