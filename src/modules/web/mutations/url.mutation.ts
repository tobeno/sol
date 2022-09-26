import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Url } from '../../data/url';
import { Response } from '../response';

declare module '../../data/url' {
  interface Url {
    get(options?: Parameters<typeof web.get>[1]): Response;
    post(
      data?: Parameters<typeof web.post>[1],
      options?: Parameters<typeof web.post>[2],
    ): Response;
    patch(
      data?: Parameters<typeof web.patch>[1],
      options?: Parameters<typeof web.patch>[2],
    ): Response;
    put(
      data?: Parameters<typeof web.put>[1],
      options?: Parameters<typeof web.put>[2],
    ): Response;
    delete(options?: Parameters<typeof web.delete>[1]): Response;
    head(options?: Parameters<typeof web.head>[1]): Response;
    fetch(options?: Parameters<typeof web.fetch>[1]): Response;
  }
}

mutateClass(
  Url,
  definePropertiesMutation({
    get: {
      value(options: Parameters<typeof web.get>[1] = {}) {
        return web.get(this.value, options);
      },
    },
    post: {
      value(
        data: Parameters<typeof web.post>[1] = null,
        options: Parameters<typeof web.post>[2] = {},
      ) {
        return web.post(this.value, data, options);
      },
    },
    patch: {
      value(
        data: Parameters<typeof web.patch>[1] = null,
        options: Parameters<typeof web.patch>[2] = {},
      ) {
        return web.patch(this.value, data, options);
      },
    },
    put: {
      value(
        data: Parameters<typeof web.put>[1] = null,
        options: Parameters<typeof web.put>[2] = {},
      ) {
        return web.put(this.value, data, options);
      },
    },
    delete: {
      value(options: Parameters<typeof web.delete>[1] = {}) {
        return web.delete(this.value, options);
      },
    },
    head: {
      value(options: Parameters<typeof web.head>[1] = {}) {
        return web.head(this.value, options);
      },
    },
    fetch: {
      value(options: Parameters<typeof web.fetch>[1] = {}) {
        return web.fetch(this.value, {
          method: 'GET',
          ...options,
        });
      },
    },
  }),
);
