import { Text } from '../data/text';
import { openMermaidLive } from '../../utils/mermaid';
import { Wrapper } from '../data/wrapper';
import { unwrap } from '../../utils/data';

/**
 * Class for generating graphs.
 */
export class Graph extends Wrapper<string> {
  open() {
    openMermaidLive(this.value);
  }

  static create(value: string | Text): Graph {
    return new Graph(unwrap(value));
  }
}
