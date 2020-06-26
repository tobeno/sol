import { DataMapper } from './data-mapper';
import { DataTransformation } from '../data-transformation';
import { DataType } from '../data-type';
import { Wrapper } from '../wrapper';
import { Constructor } from '../../interfaces/util';

/**
 * A mapper, which adds / removes a wrapper class, before passing the transformation on to another mapper
 */
export class WrappingMapper implements DataMapper<any, any> {
  constructor(
    readonly wrapper: Constructor<Wrapper>,
    readonly mapper: DataMapper<any, any>,
  ) {}

  get wrapperType() {
    return new DataType(this.wrapper.name);
  }

  supports(input: any, transformation: DataTransformation): boolean {
    const { wrapperType } = this;

    const baseWrapped = transformation.baseType.matches(wrapperType);
    const targetWrapped = transformation.targetType.matches(wrapperType);

    if (baseWrapped) {
      transformation = transformation.withBaseType(wrapperType);
      if (input instanceof this.wrapper) {
        input = input.value;
      }
    }

    if (targetWrapped) {
      transformation = transformation.withTargetType(wrapperType);
    }

    return this.mapper.supports(input, transformation);
  }

  map(input: any, transformation: DataTransformation) {
    const { wrapperType } = this;

    const baseWrapped = transformation.baseType.matches(wrapperType);
    const targetWrapped = transformation.targetType.matches(wrapperType);

    if (baseWrapped) {
      transformation = transformation.withBaseType(DataType.Object);
      if (input instanceof this.wrapper) {
        input = input.value;
      }
    }

    if (targetWrapped) {
      transformation = transformation.withTargetType(DataType.Object);
    }

    let output;
    if (!transformation.baseType.matches(transformation.targetType)) {
      output = this.mapper.map(input, transformation);
    } else {
      output = input;
    }

    if (targetWrapped) {
      output = new this.wrapper(output);
    }

    return output;
  }
}
