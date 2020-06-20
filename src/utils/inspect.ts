import * as util from 'util';

export function inspect(output: any) {
  if (typeof output === 'string') {
    return output;
  }

  if (typeof output === 'object') {
    // HTML (cheerio)
    if (['tag'].includes(output.type) && output.children) {
      return global.cheerio.html(output);
    } else if (
      output[0] &&
      ['tag'].includes(output[0].type) &&
      output[0].children
    ) {
      return Array.from<any>(output)
        .filter((item) => item.type === 'tag')
        .map((item) => global.cheerio.html(item))
        .join('\n');
    } else if (output.type === 'root' && output.children) {
      return Array.from<any>(output.children)
        .filter((item) => item.type === 'tag')
        .map((item) => global.cheerio.html(item))
        .join('\n');
    } else if (output[0] && output[0].type === 'root' && output[0].children) {
      return Array.from<any>(output[0].children)
        .filter((item) => item.type === 'tag')
        .map((item) => global.cheerio.html(item))
        .join('\n');
    }
  }

  return util.inspect(output);
}
