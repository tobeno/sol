import { JoinMapper } from './join-mapper';
import { DataFormat } from '../data-format';

export class TextNewlineSeparatedMapper extends JoinMapper {
  constructor() {
    super('\n', DataFormat.TextNewlineSeparated);
  }
}
