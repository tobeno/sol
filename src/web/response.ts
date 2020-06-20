import { AxiosResponse } from 'axios';
import { inspect } from 'util';
import { WithPrint } from '../wrappers/with-print';
import { WithCopy } from '../wrappers/with-copy';
import { WithFile } from '../wrappers/with-file';
import { csv } from '../data/csv';
import { json } from '../data/json';
import { ast } from '../data/ast';
import { html } from 'cheerio';
import { xml } from '../data/xml';
import { yaml } from '../data/yaml';
import { WithEdit } from '../wrappers/with-edit';

class UnwrappedResponse {
  constructor(readonly axiosResponse: AxiosResponse) {}

  get data() {
    return this.axiosResponse.data;
  }

  get ext() {
    if (this.contentType === 'text/html') {
      return 'html';
    } else if (['text/xml', 'application/xml'].includes(this.contentType)) {
      return 'xml';
    } else if (
      [
        'text/vnd.yaml',
        'text/yaml',
        'text/x-yaml',
        'application/x-yaml',
      ].includes(this.contentType)
    ) {
      return 'yaml';
    } else if (this.contentType === 'application/json') {
      return 'json';
    } else {
      return 'txt';
    }
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

  get yaml() {
    return yaml(this.text);
  }

  get json() {
    return json(this.data);
  }

  get ast() {
    return ast(this.text);
  }

  get xml() {
    return xml(this.text);
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
  WithEdit(WithCopy(WithFile(UnwrappedResponse))),
) {}
