import { compressString } from './compress';

/**
 * Creates a state for https://mermaid.live/ from a Mermaid diagram
 */
export function createMermaidLiveState(mermaid: string): any {
  return {
    code: mermaid,
    mermaid: '{"theme":"default"}',
    autoSync: true,
    updateDiagram: true,
    updateEditor: false,
  };
}

/**
 * Opens a Mermaid diagram on https://mermaid.live/
 */
export function openMermaidLive(mermaid: string): void {
  open(
    `https://mermaid.live/edit#pako:${compressString(
      JSON.stringify(createMermaidLiveState(mermaid)),
    )}`,
  );
}
