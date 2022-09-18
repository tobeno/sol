import '../../src/setup';
import tmp from 'tmp';

import { File } from '../../src/modules/storage/file';

import { readFileSync } from 'fs';
import { Data } from '../../src/modules/data/data';
import { Text } from '@sol/modules/data/text';

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

describe('data module', () => {
  describe('transformation', () => {
    describe('file', () => {
      it('should transform a JSON file', async () => {
        const data = File.create<ProductsFile>(
          `${__dirname}/../assets/products.json`,
        ).json;
        const obj = data.value;

        expect(obj).toHaveProperty('products');

        (obj as any).variants = Array.from(
          Data.create(obj.products).extract('variants').value,
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
        const data = File.create<ProductsFile>(
          `${__dirname}/../assets/products.yaml`,
        ).yaml;
        const obj = data.value;

        expect(obj).toHaveProperty('products');

        const tmpFile = tmp.fileSync();
        data.yaml.saveAs(tmpFile.name);
        expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
        tmpFile.removeCallback();
      });

      it('should transform a CSV file', async () => {
        let data = File.create<ProductVariant[]>(
          `${__dirname}/../assets/variants.csv`,
        ).csv;

        data = data.sort((a, b) => a.quantity - b.quantity);

        const tmpFile = tmp.fileSync();
        data.csv.saveAs(tmpFile.name);
        expect(readFileSync(tmpFile.name, 'utf-8')).toMatchSnapshot();
        tmpFile.removeCallback();
      });
    });

    describe('object', () => {
      it('should transform an array', async () => {
        let jsonData = Data.create([{ id: '1' }, { id: '2' }] as {
          id: string;
        }[]);

        expect(jsonData.json.value).toMatchSnapshot();

        const filteredData = jsonData.filter((item) => item.id === '1');

        const mappedData = filteredData.map((item) => item.id);

        expect(mappedData.value).toEqual(['1']);
      });

      it('should transform an object', async () => {
        let data = Data.create({
          'product-1': { name: 'Shoe' },
          'product-2': { name: 'Shirt' },
        } as Record<string, { name: string }>);

        expect(data.json.value).toMatchSnapshot();

        const filteredData = data.filter((item) => item.name === 'Shoe');

        const mappedData = filteredData.map((item) => item.name);

        expect(mappedData.value).toEqual({ 'product-1': 'Shoe' });
      });

      it('should transform a string', async () => {
        let text = Text.create(
          'Product 1: Shoe\nProduct 2: Shirt\nProduct 3: Jeans',
        );

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

        text = data.join('.');

        expect(text.value).toMatchSnapshot();
      });
    });
  });
});
