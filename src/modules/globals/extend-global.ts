import { globals } from './globals';
import { definePropertiesMutation, mutateObject } from '../utils/mutation';
import { FromPropertyDescriptorMap } from '../../interfaces/object';

declare global {
  namespace NodeJS {
    type Global = FromPropertyDescriptorMap<typeof globals>;
  }
}

mutateObject(global, definePropertiesMutation(globals));
