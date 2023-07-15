import { openMermaidLive } from '../../../utils/mermaid.utils';
import { unwrap } from '../../../utils/wrapper.utils';
import { Text } from '../../../wrappers/text.wrapper';
import { Wrapper } from '../../../wrappers/wrapper.wrapper';

/**
 * Class for generating graphs.
 */
export class Graph extends Wrapper<string> {
  browse() {
    openMermaidLive(this.value);
  }

  open() {
    openMermaidLive(this.value);
  }

  static create(value: string | Text): Graph {
    return new Graph(unwrap(value));
  }
}
