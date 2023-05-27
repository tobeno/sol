import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from '../wrappers/response';
import { deasync } from './async';

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

function getAxios() {
  return require('axios') as typeof import('axios')['default'];
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
  get: wrap(() => getAxios().get),
  post: wrap(() => getAxios().post),
  delete: wrap(() => getAxios().delete),
  patch: wrap(() => getAxios().patch),
  put: wrap(() => getAxios().put),
  head: wrap(() => getAxios().head),
  request: wrap(() => getAxios().request),
};
