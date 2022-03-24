import { globals } from './globals';
import { definePropertiesMutation, mutateGlobals } from '../utils/mutation';

// DOM globals
declare global {
  type BufferSource = any;
  type FormData = any;
  type URLSearchParams = any;
}

mutateGlobals(definePropertiesMutation(globals));
