import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from './response';
import { deasync } from '../../utils/async';

function wrap<FnType extends (...args: any) => Promise<AxiosResponse>>(
  makeFn: () => FnType,
): (...params: Parameters<FnType>) => Response {
  let fnSync: ((...args: Parameters<FnType>) => any) | null = null;

  return (...args: Parameters<FnType>) => {
    if (!fnSync) {
      const fn = makeFn();
      fnSync = deasync(fn);
    }

    return new Response(fnSync(...args));
  };
}

export const web = {
  /**
   * Fake fetch to execute fetch(...) statments copied from browser
   */
  fetch: (
    url: string,
    init: {
      method?: AxiosRequestConfig['method'];
      headers?: AxiosRequestConfig['headers'];
    },
  ) => {
    return web.request({
      url,
      ...init,
    });
  },
  get: wrap(() => require('axios').get),
  post: wrap(() => require('axios').post),
  delete: wrap(() => require('axios').delete),
  patch: wrap(() => require('axios').patch),
  put: wrap(() => require('axios').put),
  head: wrap(() => require('axios').head),
  request: wrap(() => require('axios').request),
};
