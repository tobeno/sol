import { DataTransformer } from './data.transformer';
import { DataTransformation } from '../data-transformation';
import { DataType, DataTypeMatchType } from '../../data/data-type';
import { Wrapper } from '../../data/wrapper';
import { Text } from '../../data/text';
import { Constructor } from '../../../interfaces/util';

/**
 * A transformer, which adds / removes a wrapper class, before passing the transformation on to another mapper
 */
export class WrappingTransformer implements DataTransformer<any, any> {
  constructor(
    readonly wrapper: Constructor<Wrapper>,
    readonly wrapperValueType: DataType,
    readonly transformer: DataTransformer<any, any>,
  ) {}

  get wrapperType(): DataType {
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

    return this.transformer.supports(input, transformation);
  }

  transform(input: any, transformation: DataTransformation): any {
    const { wrapperType } = this;

    const baseWrapped = transformation.baseType.matches(
      wrapperType,
      DataTypeMatchType.Partial,
    );
    const targetWrapped = transformation.targetType.matches(
      wrapperType,
      DataTypeMatchType.Partial,
    );

    if (baseWrapped) {
      transformation = transformation.withBaseType(
        this.wrapperValueType.withFormat(transformation.baseType.format),
      );
      if (input instanceof this.wrapper) {
        input = input.value;
      }
    }

    if (targetWrapped) {
      transformation = transformation.withTargetType(
        this.wrapperValueType.withFormat(transformation.targetType.format),
      );
    }

    let output;
    if (!transformation.baseType.matches(transformation.targetType)) {
      output = this.transformer.transform(input, transformation);
    } else {
      output = input;
    }

    if (targetWrapped) {
      output = new this.wrapper(output);

      if (transformation.targetType.format && output instanceof Text) {
        output.setFormat(transformation.targetType.format);
      }
    }

    return output;
  }
}
