import { open } from '../../../utils/open.utils';
import { Url } from '../../../wrappers/url.wrapper';
import { Wrapper } from '../../../wrappers/wrapper.wrapper';

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
