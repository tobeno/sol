import { DataFormat } from '../../../wrappers/data-format';
import { DataType } from '../../../wrappers/data-type';
import { Graph } from '../../visualize/wrappers/graph';
import { StringTransformer } from './string.transformer';

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
