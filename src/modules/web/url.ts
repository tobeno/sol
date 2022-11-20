import { Wrapper } from '../data/wrapper';
import { URL, URLSearchParams } from 'url';
import { Text } from '../data/text';
import { Response } from './response';

export class Url extends Wrapper<string> {
  constructor(value: string | URL) {
    if (value instanceof URL) {
      value = value.toJSON();
    }

    super(value);
  }

  get text(): Text {
    return Text.create(this.value);
  }

  set text(text: Text) {
    this.value = String(text);
  }

  get parsed(): URL {
    return new URL(this.value);
  }

  set parsed(url: URL) {
    this.value = url.toString();
  }

  get protocol(): string {
    return this.parsed.protocol;
  }

  set protocol(protocol: string) {
    const parsed = this.parsed;
    parsed.protocol = protocol;
    this.parsed = parsed;
  }

  get hostname(): string {
    return this.parsed.hostname;
  }

  set hostname(host: string) {
    const parsed = this.parsed;
    parsed.hostname = String(host);
    this.parsed = parsed;
  }

  get pathname(): string {
    return this.parsed.pathname;
  }

  set pathname(pathname: string) {
    const parsed = this.parsed;
    parsed.pathname = String(pathname);
    this.parsed = parsed;
  }

  get port(): string {
    return this.parsed.port;
  }

  set port(port: string | number | null) {
    const parsed = this.parsed;
    parsed.port = String(port || '');
    this.parsed = parsed;
  }

  get query(): URLSearchParams {
    return this.parsed.searchParams;
  }

  set query(params: URLSearchParams | any | null) {
    if (!(params instanceof URLSearchParams)) {
      params = new URLSearchParams(params || {});
    }

    const parsed = this.parsed;
    parsed.search = params.toString();
    this.parsed = parsed;
  }

  get hash(): string {
    return this.parsed.hash;
  }

  set hash(hash: string) {
    const parsed = this.parsed;
    parsed.hash = hash;
    this.parsed = parsed;
  }

  get(options?: Parameters<typeof web.get>[1]): Response {
    return web.get(this.value, options);
  }

  post(
    data?: Parameters<typeof web.post>[1],
    options?: Parameters<typeof web.post>[2],
  ): Response {
    return web.post(this.value, data, options);
  }

  patch(
    data?: Parameters<typeof web.patch>[1],
    options?: Parameters<typeof web.patch>[2],
  ): Response {
    return web.patch(this.value, data, options);
  }

  put(
    data?: Parameters<typeof web.put>[1],
    options?: Parameters<typeof web.put>[2],
  ): Response {
    return web.put(this.value, data, options);
  }

  delete(options?: Parameters<typeof web.delete>[1]): Response {
    return web.delete(this.value, options);
  }

  head(options?: Parameters<typeof web.head>[1]): Response {
    return web.head(this.value, options);
  }

  fetch(options?: Parameters<typeof web.fetch>[1]): Response {
    return web.fetch(this.value, {
      method: 'GET',
      ...options,
    });
  }

  static create(value: Text | string | any): Url {
    if (value instanceof Url) {
      return value;
    }

    return new Url(String(value));
  }
}
