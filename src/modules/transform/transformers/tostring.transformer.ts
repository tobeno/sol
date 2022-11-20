import { DataTransformer } from './data.transformer';
import { DataTransformation } from '../data-transformation';

/**
 * Transformer for converting data to strings using toString().
 */
export class ToStringTransformer implements DataTransformer<any, any> {
  supports(input: any, transformation: DataTransformation): boolean {
    const { targetType } = transformation;
    return targetType.type === 'string' && !targetType.format;
  }

  transform(input: any): string {
    return String(input);
  }
}
