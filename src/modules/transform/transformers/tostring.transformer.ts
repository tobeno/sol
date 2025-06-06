import { DataTransformation } from '../data-transformation';
import type { DataTransformer } from './data.transformer';

/**
 * Transformer for converting data to strings using toString().
 */
export class ToStringTransformer implements DataTransformer<any, any> {
  supports(_input: any, transformation: DataTransformation): boolean {
    const { targetType } = transformation;
    return targetType.type === 'string' && !targetType.format;
  }

  transform(input: any): string {
    return String(input);
  }
}
