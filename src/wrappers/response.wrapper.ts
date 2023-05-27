import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios';
import { RawAxiosResponseHeaders } from 'axios';
import { inspect } from 'util';
import { web } from '../utils/web.utils';
import { Data } from './data.wrapper';
import { Text } from './text.wrapper';
import { Wrapper } from './wrapper.wrapper';

/**
 * Wrapper for a HTTP response.
 */
export class Response extends Wrapper<AxiosResponse> {
  /**
   * Returns the request that was used to create this response.
   */
  get request(): AxiosRequestConfig {
    return this.value.config;
  }

  /**
   * Returns the content of the response.
   */
  get content(): Text {
    let content = this.value.data;
    if (content && typeof content === 'object') {
      content = JSON.stringify(content, null, 2);
    }

    return Text.create(content, this.contentFormat);
  }

  /**
   * Returns the format of the content.
   */
  get contentFormat(): string {
    const contentType = this.value.headers['content-type'];

    return contentType ? contentType.split(';')[0] : '';
  }

  /**
   * Returns the headers of the response.
   */
  get headers(): RawAxiosResponseHeaders | AxiosResponseHeaders {
    return this.value.headers;
  }

  /**
   * Returns the status code of the response.
   */
  get status(): number {
    return this.value.status;
  }

  /**
   * Returns the status text of the response.
   */
  get statusText(): string {
    return this.value.statusText;
  }

  /**
   * Returns the command that lead to this response.
   */
  get cmd(): Text {
    return Text.create(`web.request(${JSON.stringify(this.request)})`);
  }

  /**
   * Refetches the response.
   */
  refresh(): Response {
    return web.request(this.value.config);
  }

  /**
   * Returns a seriolizable version of this response (without circular references).
   */
  get serializable(): Data {
    return Data.create({
      status: this.value.status,
      statusText: this.value.statusText,
      headers: this.value.headers,
      data: this.value.data,
      request: {
        url: this.value.config.url,
        method: (this.value.config.method || 'get').toLowerCase(),
        auth: this.value.config.auth,
        headers: this.value.config.headers,
      },
    });
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log).
   */
  [inspect.custom](): string {
    return `Response ${inspect(this.serializable.value)}`;
  }

  toString(): string {
    return `Response ${inspect(this.value.data)}`;
  }
}
