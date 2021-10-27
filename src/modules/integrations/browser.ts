import { Url } from '../data/url';
import { Wrapper } from '../data/wrapper';
import open from 'open';
import { awaitSync } from '../utils/async';

export function browse(url?: any): Url {
  if (url instanceof Wrapper) {
    url = url.value;
  }

  if (url?.startsWith('file:')) {
    awaitSync(
      open(url, {
        app: {
          name: open.apps.chrome,
        },
      }),
    );
  } else {
    awaitSync(open(url || 'https://www.google.com'));
  }

  return new Url(url);
}
