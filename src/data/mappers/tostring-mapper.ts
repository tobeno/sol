import { DataMapper } from './data-mapper';
import { DataTransformation } from '../data-transformation';

export class ToStringMapper implements DataMapper<any, any> {
  supports(input: any, transformation: DataTransformation): boolean {
    const { targetType } = transformation;
    return targetType.type === 'string' && !targetType.format;
  }

  map(input: any) {
    return String(input);
  }
}
