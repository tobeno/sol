import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from '../wrappers/response.wrapper';

function wrap<FnType extends (...args: any) => Promise<AxiosResponse>>(
  makeFn: () => FnType,
): (...params: Parameters<FnType>) => Promise<Response> {
  let fn: ((...args: Parameters<FnType>) => Promise<any>) | null = null;

  return async (...args: Parameters<FnType>) => {
    if (!fn) {
      fn = makeFn();
    }

    return new Response(await fn(...args));
  };
}

function getAxios() {
  return require('axios') as (typeof import('axios'))['default'];
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
