import { JoinTransformer } from './join-transformer';
import { DataFormat } from '../data-format';

export class TextSemicolonSeparatedTransformer extends JoinTransformer {
  constructor() {
    super(';', DataFormat.TextSemicolonSeparated);
  }
}
