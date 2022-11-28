import { DataType, DataTypeMatchType } from './data-type';
import { DataFormat } from './data-format';

describe('DataType', () => {
  describe('matches', () => {
    it('should return true if it matches exactly', async () => {
      const dataType = new DataType('string', DataFormat.Csv);
      const otherDataType = new DataType('string', DataFormat.Csv);
      expect(dataType.matches(otherDataType)).toBe(true);
    });

    it('should return false if it does not matches exactly', async () => {
      const dataType = new DataType('string', DataFormat.Csv);
      const otherDataType = new DataType('string', DataFormat.Json);
      expect(dataType.matches(otherDataType)).toBe(false);
    });

    it('should return true if it matches partially', async () => {
      const dataType = new DataType('string', DataFormat.Csv);
      const otherDataType = new DataType('string', DataFormat.Json);
      expect(dataType.matches(otherDataType, DataTypeMatchType.Partial)).toBe(
        true,
      );
    });

    it('should return false if it does not matches partially', async () => {
      const dataType = new DataType('string', DataFormat.Csv);
      const otherDataType = new DataType('Text', DataFormat.Csv);
      expect(dataType.matches(otherDataType, DataTypeMatchType.Partial)).toBe(
        false,
      );
    });
  });

  describe('withoutFormat', () => {
    it('should remove the format', async () => {
      const dataType = new DataType('string', DataFormat.Csv);
      expect(dataType.withoutFormat().format).toBeNull();
    });
  });

  describe('withFormat', () => {
    it('should add the format', async () => {
      const dataType = new DataType('string');
      expect(dataType.withFormat(DataFormat.Csv).format).toBe(DataFormat.Csv);
    });
  });

  describe('fromString', () => {
    it('should convert a string without format to a DataType', async () => {
      const dataType = DataType.fromString('string');
      expect(dataType.type).toBe('string');
      expect(dataType.format).toBeNull();
    });

    it('should convert a string with format to a DataType', async () => {
      const dataType = DataType.fromString('string<text/csv>');
      expect(dataType.type).toBe('string');
      expect(dataType.format).toBe(DataFormat.Csv);
    });
  });

  describe('toString', () => {
    it('should convert a DataType without format to a string', async () => {
      const dataType = new DataType('string');
      expect(dataType.toString()).toBe('string');
    });

    it('should convert a DataType with format to a string', async () => {
      const dataType = new DataType('string', DataFormat.Csv);
      expect(dataType.toString()).toBe('string<text/csv>');
    });
  });
});
