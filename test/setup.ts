import { globals } from './globals';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../dist/src/modules/utils/mutation';

mutateGlobals(definePropertiesMutation(globals));
