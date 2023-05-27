import { unwrap } from '../../../utils/data';
import { openMermaidLive } from '../../../utils/mermaid';
import { Text } from '../../../wrappers/text';
import { Wrapper } from '../../../wrappers/wrapper';

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
