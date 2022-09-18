import { JoinTransformer } from './join.transformer';
import { DataFormat } from '../../data/data-format';

export class TextNewlineSeparatedTransformer extends JoinTransformer {
  constructor() {
    super('\n', DataFormat.TextNewlineSeparated);
  }
}
