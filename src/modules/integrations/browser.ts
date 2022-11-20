import { Url } from '../web/url';
import { Wrapper } from '../data/wrapper';
import { open } from './open';

/**
 * Opens the given URL in the default browser.
 */
export function browse(url?: any): Url {
  if (url instanceof Wrapper) {
    url = url.value;
  }

  if (!url?.startsWith('http')) {
    open(url, 'chrome');
  } else {
    open(url || 'https://www.google.com');
  }

  return Url.create(url);
}
