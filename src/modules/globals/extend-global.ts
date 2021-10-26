import { globals } from './globals';
import { definePropertiesMutation, mutateGlobals } from '../utils/mutation';

mutateGlobals(definePropertiesMutation(globals));
