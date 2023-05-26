import { deflate, inflate } from 'pako';

/**
 * Compresses and base64 encodes the string using pako (zlib)
 */
export function compressString(value: string): string {
  return Buffer.from(deflate(value)).toString('base64url');
}

/**
 * base64 decodes and decompresses the string using pako
 */
export function decompressString(value: string): string {
  if (value.startsWith('pako:')) {
    value = value.slice(5);
  }

  return inflate(Buffer.from(value, 'base64url'), {
    to: 'string',
  });
}
