import { AxiosResponse } from 'axios';
import { inspect } from 'util';
import { json, html, csv, ast } from '../data/fn';
import { WithPrint } from '../extensions/print';
import { WithCopy } from '../extensions/copy';
import { WithFile } from '../extensions/file';

class UnwrappedResponse {
  constructor(readonly axiosResponse: AxiosResponse) {}

  get data() {
    return this.axiosResponse.data;
  }

  get text() {
    const { data } = this.axiosResponse;
    if (typeof data === 'string' && this.contentType !== 'application/json') {
      return data;
    }

    return JSON.stringify(data);
  }

  get csv() {
    return csv(this.text);
  }

  get json() {
    return json(this.data);
  }

  get ast() {
    return ast(this.text);
  }

  get html() {
    return html(this.text);
  }

  get headers() {
    return this.axiosResponse.headers;
  }

  get status() {
    return this.axiosResponse.status;
  }

  get statusText() {
    return this.axiosResponse.statusText;
  }

  get contentType() {
    const contentType = this.axiosResponse.headers['content-type'];

    return contentType ? contentType.split(';')[0] : null;
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.axiosResponse.data;
  }
}

export class Response extends WithPrint(
  WithCopy(WithFile(UnwrappedResponse)),
) {}
