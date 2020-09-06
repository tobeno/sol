import { DataTransformer } from './data-transformer';
import { DataTransformation } from '../data-transformation';
import { DataType } from '../data-type';
import { Wrapper } from '../wrapper';
import { Constructor } from '../../interfaces/util';

/**
 * A mapper, which adds / removes a wrapper class, before passing the transformation on to another mapper
 */
export class WrappingTransformer implements DataTransformer<any, any> {
  constructor(
    readonly wrapper: Constructor<Wrapper>,
    readonly wrapperValueType: DataType,
    readonly mapper: DataTransformer<any, any>,
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

  transform(input: any, transformation: DataTransformation) {
    const { wrapperType } = this;

    const baseWrapped = transformation.baseType.matches(wrapperType);
    const targetWrapped = transformation.targetType.matches(wrapperType);

    if (baseWrapped) {
      transformation = transformation.withBaseType(this.wrapperValueType);
      if (input instanceof this.wrapper) {
        input = input.value;
      }
    }

    if (targetWrapped) {
      transformation = transformation.withTargetType(this.wrapperValueType);
    }

    let output;
    if (!transformation.baseType.matches(transformation.targetType)) {
      output = this.mapper.transform(input, transformation);
    } else {
      output = input;
    }

    if (targetWrapped) {
      output = new this.wrapper(output);
    }

    return output;
  }
}
