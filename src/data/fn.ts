import { Json } from './json';
import { Html } from './html';
import { Csv } from './csv';
import * as jsonataImport from 'jsonata';
import * as cheerioImport from 'cheerio';
import { Ast } from './ast';

export const cheerio = cheerioImport;

export const jsonata = jsonataImport;

export function html(data: string) {
  return new Html(data);
}

export function csv(data: string) {
  return new Csv(data);
}

export function json(...args: ConstructorParameters<typeof Json>) {
  return new Json(...args);
}

export function ast(...args: ConstructorParameters<typeof Ast>) {
  return new Ast(...args);
}
