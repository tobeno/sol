import { inspect } from 'util';
import { Data, wrapObject } from '../data/data';
import { AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from 'axios';
import { DataFormat } from '../data/data-format';
import { DataType } from '../data/data-type';
import { web } from './index';
import { Text, wrapString } from '../data/text';

export class Response extends Data {
  constructor(private axiosResponse: AxiosResponse) {
    super({
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers: axiosResponse.headers,
      data: axiosResponse.data,
      request: {
        url: axiosResponse.config.url,
        method: (axiosResponse.config.method || 'get').toLowerCase(),
        auth: axiosResponse.config.auth,
        headers: axiosResponse.config.headers,
      },
    });
  }

  get request(): AxiosRequestConfig {
    return this.value.request;
  }

  get content(): Data {
    return wrapObject(this.value.data);
  }

  get contentExt(): string {
    return DataFormat.toExt(this.contentFormat);
  }

  get contentType(): DataType {
    return DataType.String.withFormat(this.contentFormat);
  }

  get contentFormat(): string {
    const contentType = this.value.headers['content-type'];

    return contentType ? contentType.split(';')[0] : null;
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
    return wrapString(`web.request(${JSON.stringify(this.request)})`);
  }

  refresh(): Response {
    return web.request(this.axiosResponse.config);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    return this.value;
  }

  toString(): string {
    return this.json.toString();
  }
}

/* export class Response extends WithPrint(
  WithEdit(WithCopy(WithSave(Response))),
) {} */
