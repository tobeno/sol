import { JoinMapper } from './join-mapper';
import { DataFormat } from '../data-format';

export class TextSemicolonSeparatedMapper extends JoinMapper {
  constructor() {
    super(';', DataFormat.TextSemicolonSeparated);
  }
}
