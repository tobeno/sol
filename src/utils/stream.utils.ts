import { Stream } from 'stream';
import { awaitSync } from './async.utils';

export function readTextStream(stream: Stream): string {
  return awaitSync(
    new Promise((resolve) => {
      const chunks: string[] = [];
      stream.on('data', (chunk) => {
        chunks.push(chunk.toString());
      });
      stream.on('end', () => {
        resolve(chunks.join(''));
      });
    }),
  );
}
