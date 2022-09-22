import { inspect } from 'util';
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios';
import { DataFormat } from '../data/data-format';
import { DataType } from '../data/data-type';
import { web } from './web';
import { Text } from '../data/text';
import { Wrapper } from '../data/wrapper';
import { ResponseContent } from './response-content';
import { Data } from '../data/data';

export class Response extends Wrapper<AxiosResponse> {
  get request(): AxiosRequestConfig {
    return this.value.config;
  }

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

  get content(): ResponseContent {
    return ResponseContent.create(this.value.data);
  }

  get contentExt(): string {
    return DataFormat.toExt(this.contentFormat);
  }

  get contentType(): DataType {
    return DataType.String.withFormat(this.contentFormat);
  }

  get contentFormat(): string {
    const contentType = this.value.headers['content-type'];

    return contentType ? contentType.split(';')[0] : '';
  }

  get headers(): AxiosResponseHeaders {
    return this.value.headers;
  }

  get status(): number {
    return this.value.status;
  }

  get statusText(): string {
    return this.value.statusText;
  }

  get cmd(): Text {
    return Text.create(`web.request(${JSON.stringify(this.request)})`);
  }

  refresh(): Response {
    return web.request(this.value.config);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    return `Response ${inspect(this.serializable.value)}`;
  }

  toString(): string {
    return `Response ${inspect(this.value.data)}`;
  }
}
