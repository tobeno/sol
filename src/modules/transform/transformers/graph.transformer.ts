import { StringTransformer } from './string.transformer';
import { DataType } from '../../data/data-type';
import { DataFormat } from '../../data/data-format';
import { Graph } from '../../visualize/graph';

/**
 * Transformer for converting Graph wrappers from and to strings.
 */
export class GraphTransformer extends StringTransformer<Graph> {
  constructor() {
    super(DataType.Graph, DataFormat.Mermaid);
  }

  stringify(input: Graph): string {
    return input.value;
  }

  parse(input: string): Graph {
    return Graph.create(input);
  }
}
