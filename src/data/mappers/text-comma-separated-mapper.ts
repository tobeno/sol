import { JoinMapper } from './join-mapper';
import { DataFormat } from '../data-format';

export class TextCommaSeparatedMapper extends JoinMapper {
  constructor() {
    super(',', DataFormat.TextCommaSeparated);
  }
}
