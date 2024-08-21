import { openMermaidLive } from '../../../utils/mermaid.utils';
import { unwrap } from '../../../utils/wrapper.utils';
import { Text } from '../../../wrappers/text.wrapper';
import { Wrapper } from '../../../wrappers/wrapper.wrapper';

/**
 * Class for generating graphs.
 */
export class Graph extends Wrapper<string> {
  static readonly usageHelp = `
> graph(\`
mindmap
  root((mindmap))
    Basics
      Time
    Work
\`)
> graph(\`
flowchart LR
  Basics --> Time
  Work
\`)
  `.trim();

  browse() {
    openMermaidLive(this.value);
  }

  open() {
    openMermaidLive(this.value);
  }

  static create(value: string | Text): Graph {
    const result = new Graph(unwrap(value));

    return withHelp(
      result,
      `
Graph wrapper around a Mermaid graph string.

Usage:
${Graph.usageHelp}
    `,
    );
  }
}
