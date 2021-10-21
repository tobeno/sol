import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Response } from './response';
import { deasync } from '../utils/async';

function wrap<FnType extends (...args: any) => Promise<AxiosResponse>>(
  fn: FnType,
): (...params: Parameters<FnType>) => Response {
  const fnSync = deasync(fn);

  return (...args: Parameters<typeof fnSync>) => {
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
      method: AxiosRequestConfig['method'];
      headers: AxiosRequestConfig['headers'];
    },
  ) => {
    return web.request({
      url,
      ...init,
    });
  },
  get: wrap(axios.get),
  post: wrap(axios.post),
  delete: wrap(axios.delete),
  patch: wrap(axios.patch),
  put: wrap(axios.put),
  head: wrap(axios.head),
  request: wrap(axios.request),
};
