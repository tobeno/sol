import { AbstractConstructor, Constructor } from '../../interfaces/util';

export abstract class Mutation<TargetType> {
  abstract mutate(target: TargetType): void;

  abstract unmutate(target: TargetType): void;
}

class DefinePropertiesMutation<TargetType> extends Mutation<TargetType> {
  constructor(public properties: PropertyDescriptorMap & ThisType<TargetType>) {
    super();
  }

  mutate(target: TargetType): void {
    Object.defineProperties(target, this.properties);
  }

  unmutate(target: TargetType): void {
    Object.keys(this.properties).forEach((key) => {
      delete (target as any)[key];
    });
  }
}

export const MutationsSymbol = Symbol('mutations');

export function definePropertiesMutation<TargetType>(
  properties: PropertyDescriptorMap & ThisType<TargetType>,
): Mutation<TargetType> {
  return new DefinePropertiesMutation<TargetType>(
    Object.entries(properties).reduce((result, [name, config]) => {
      result[name] = {
        configurable: true,
        enumerable: false,
        ...config,
      };

      return result;
    }, {} as PropertyDescriptorMap & ThisType<TargetType>),
  );
}

export function customMutation<TargetType>(
  mutate: (target: TargetType) => void,
  unmutate: (target: TargetType) => void,
) {
  return class CustomMutation extends Mutation<TargetType> {
    mutate = mutate;
    unmutate = unmutate;
  };
}

export function getAppliedMutations(target: any): Mutation<any>[] {
  if (target === null || typeof target === 'undefined') {
    throw new Error('Invalid target given.');
  }

  let mutations: Mutation<any>[];
  if (!target[MutationsSymbol]) {
    mutations = [];

    Object.defineProperty(target, MutationsSymbol, {
      enumerable: false,
      value: mutations,
    });
  } else {
    mutations = target[MutationsSymbol];
  }

  return mutations;
}

export function mutateObject<TargetType>(
  target: TargetType,
  mutation: Mutation<TargetType>,
): void {
  if (!target) {
    throw new Error('Empty target given.');
  }

  const mutations = getAppliedMutations(target);

  if (!mutations.includes(mutation)) {
    mutation.mutate(target);

    mutations.push(mutation);
  }
}

export function unmutateObject<TargetType>(
  target: TargetType,
  mutation: Mutation<TargetType> | null = null,
): void {
  if (!target) {
    throw new Error('Empty target given.');
  }

  const mutations = getAppliedMutations(target);

  if (!mutation) {
    [...mutations].reverse().forEach((mutation) => {
      unmutateObject(target, mutation);
    });

    return;
  }

  const mutationIndex = mutations.indexOf(mutation);
  if (mutationIndex >= 0) {
    mutation.unmutate(target);

    mutations.splice(mutationIndex, 1);
  }
}

export function mutateFunction<FunctionType extends Function>(
  target: FunctionType,
  mutation: Mutation<FunctionType>,
): void {
  mutateObject(target, mutation);
}

export function unmutateFunction<FunctionType extends Function>(
  target: FunctionType,
  mutation: Mutation<FunctionType> | null = null,
): void {
  unmutateObject(target, mutation);
}

export function mutateClass<ClassType extends object>(
  target: Constructor<ClassType> | AbstractConstructor<ClassType>,
  mutation: Mutation<ClassType>,
): void {
  mutateObject(target.prototype, mutation);
}

export function unmutateClass<ClassType extends object>(
  target: Constructor<ClassType> | AbstractConstructor<ClassType>,
  mutation: Mutation<ClassType> | null = null,
): void {
  unmutateObject(target.prototype, mutation);
}
