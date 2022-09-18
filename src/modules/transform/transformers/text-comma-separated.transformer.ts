import { JoinTransformer } from './join.transformer';
import { DataFormat } from '../../data/data-format';

export class TextCommaSeparatedTransformer extends JoinTransformer {
  constructor() {
    super(',', DataFormat.TextCommaSeparated);
  }
}
