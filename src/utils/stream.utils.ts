import { Stream } from 'stream';

export async function readTextStream(stream: Stream): Promise<string> {
  return new Promise((resolve) => {
    const chunks: string[] = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });
    stream.on('end', () => {
      resolve(chunks.join(''));
    });
  });
}
