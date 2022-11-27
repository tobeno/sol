import { Wrapper } from '../data/wrapper';
import { URL, URLSearchParams } from 'url';
import { Text } from '../data/text';
import { Response } from './response';
import { MaybeWrapped } from '../../interfaces/data';

/**
 * Wrapper for an URL.
 */
export class Url extends Wrapper<string> {
  constructor(value: string | URL) {
    if (value instanceof URL) {
      value = value.toJSON();
    }

    super(value);
  }

  /**
   * Returns the URL as text.
   */
  get text(): Text {
    return Text.create(this.value);
  }

  /**
   * Sets the URL from a string.
   */
  set text(text: MaybeWrapped<string>) {
    this.value = String(text);
  }

  /**
   * Returns the parsed form of this URL.
   */
  get parsed(): URL {
    return new URL(this.value);
  }

  /**
   * Sets the parsed form of this URL.
   */
  set parsed(url: URL) {
    this.value = url.toString();
  }

  /**
   * Returns the protocol of the URL.
   */
  get protocol(): string {
    return this.parsed.protocol;
  }

  /**
   * Sets the protocol of the URL.
   */
  set protocol(protocol: string) {
    const parsed = this.parsed;
    parsed.protocol = protocol;
    this.parsed = parsed;
  }

  /**
   * Returns the host of the URL.
   */
  get hostname(): string {
    return this.parsed.hostname;
  }

  /**
   * Sets the hostname of the URL.
   */
  set hostname(host: string) {
    const parsed = this.parsed;
    parsed.hostname = String(host);
    this.parsed = parsed;
  }

  /**
   * Returns the path of the URL.
   */
  get pathname(): string {
    return this.parsed.pathname;
  }

  /**
   * Sets the path of the URL.
   */
  set pathname(pathname: string) {
    const parsed = this.parsed;
    parsed.pathname = String(pathname);
    this.parsed = parsed;
  }

  /**
   * Returns the port of the URL.
   */
  get port(): string {
    return this.parsed.port;
  }

  /**
   * Sets the port of the URL.
   */
  set port(port: string | number | null) {
    const parsed = this.parsed;
    parsed.port = String(port || '');
    this.parsed = parsed;
  }

  /**
   * Returns the query parameters of the URL.
   */
  get query(): URLSearchParams {
    return this.parsed.searchParams;
  }

  /**
   * Sets the query parameters of the URL.
   */
  set query(params: URLSearchParams | any | null) {
    if (!(params instanceof URLSearchParams)) {
      params = new URLSearchParams(params || {});
    }

    const parsed = this.parsed;
    parsed.search = params.toString();
    this.parsed = parsed;
  }

  /**
   * Returns the hash of the URL.
   */
  get hash(): string {
    return this.parsed.hash;
  }

  /**
   * Sets the hash of the URL.
   */
  set hash(hash: string) {
    const parsed = this.parsed;
    parsed.hash = hash;
    this.parsed = parsed;
  }

  /**
   * Fetches the URL using a GET request.
   */
  get(options?: Parameters<typeof web.get>[1]): Response {
    return web.get(this.value, options);
  }

  /**
   * Fetches the URL using a POST request.
   */
  post(
    data?: Parameters<typeof web.post>[1],
    options?: Parameters<typeof web.post>[2],
  ): Response {
    return web.post(this.value, data, options);
  }

  /**
   * Fetches the URL using a PATCH request.
   */
  patch(
    data?: Parameters<typeof web.patch>[1],
    options?: Parameters<typeof web.patch>[2],
  ): Response {
    return web.patch(this.value, data, options);
  }

  /**
   * Fetches the URL using a PUT request.
   */
  put(
    data?: Parameters<typeof web.put>[1],
    options?: Parameters<typeof web.put>[2],
  ): Response {
    return web.put(this.value, data, options);
  }

  /**
   * Fetches the URL using a DELETE request.
   */
  delete(options?: Parameters<typeof web.delete>[1]): Response {
    return web.delete(this.value, options);
  }

  /**
   * Fetches the URL using a HEAD request.
   */
  head(options?: Parameters<typeof web.head>[1]): Response {
    return web.head(this.value, options);
  }

  /**
   * Fetches the URL using the given options.
   */
  fetch(options?: Parameters<typeof web.fetch>[1]): Response {
    return web.fetch(this.value, {
      method: 'GET',
      ...options,
    });
  }

  static create(value: MaybeWrapped<string> | any): Url {
    if (value instanceof Url) {
      return value;
    }

    return new Url(String(value));
  }
}
