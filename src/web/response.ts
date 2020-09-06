import { inspect } from 'util';
import { Data } from '../data/data';
import { AxiosResponse } from 'axios';
import { DataFormat } from '../data/data-format';
import { DataType } from '../data/data-type';
import { wrapObject, wrapString } from '../data/transformer';
import { web } from '.';
import { Text } from '../data/text';
import { clipboard } from '../os/clipboard';
import { File } from '../storage/file';
import { saveAs } from '../storage/save';

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

  get request() {
    return this.value.request;
  }

  get content(): Data {
    return wrapObject(this.value.data, this as any);
  }

  get contentExt() {
    return DataFormat.toExt(this.contentFormat);
  }

  get contentType() {
    return DataType.String.withFormat(this.contentFormat);
  }

  get contentFormat() {
    const contentType = this.value.headers['content-type'];

    return contentType ? contentType.split(';')[0] : null;
  }

  get headers() {
    return this.value.headers;
  }

  get status() {
    return this.value.status;
  }

  get statusText() {
    return this.value.statusText;
  }

  get cmd(): Text {
    return wrapString(
      `web.request(${JSON.stringify(this.request)})`,
      null,
      this,
    );
  }

  refresh(): Response {
    return web.request(this.axiosResponse.config);
  }

  copy() {
    clipboard.text = String(this);
  }

  print() {
    console.log(String(this));
  }

  saveAs(path: string): File {
    return saveAs(this, path);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.value;
  }

  toString() {
    return this.json.toString();
  }
}

/* export class Response extends WithPrint(
  WithEdit(WithCopy(WithSave(Response))),
) {} */
