import { grep } from './storage/search';
import { file } from './storage/file';
import { dir } from './storage/directory';
import { dirs, files, glob } from './storage/item-collection';
import { web } from './web';
import { jsonata } from './integrations/jsonata';
import { cheerio } from './integrations/cheerio';
import { csv } from './data/csv';
import { html } from './data/html';
import { json } from './data/json';
import { xml } from './data/xml';
import { yaml } from './data/yaml';
import { ast, astTypes } from './data/ast';
import { clipboard } from './os/clipboard';
import * as arrayUtils from './utils/array';
import * as objectUtils from './utils/object';
import * as textUtils from './utils/text';
import { cwd } from './shell/fn';
import { log } from './utils/log';
import { sol } from './sol';
import { vscode, play, replay, unwatchPlay } from './integrations/vscode';
import * as shell from './shell/shelljs';

export const globals = {
  ast,
  astTypes,
  cheerio,
  clipboard,
  csv,
  cwd,
  dir,
  dirs,
  fetch: web.fetch,
  file,
  files,
  glob,
  grep,
  html,
  json,
  jsonata,
  log,
  play,
  replay,
  shell,
  sol,
  unwatchPlay,
  vscode,
  web,
  xml,
  yaml,
  utils: {
    ...arrayUtils,
    ...objectUtils,
    ...textUtils,
  },
};

export type Globals = typeof globals;

declare global {
  const {
    ast,
    astTypes,
    clipboard,
    csv,
    cwd,
    dir,
    dirs,
    file,
    files,
    glob,
    grep,
    html,
    json,
    jsonata,
    log,
    play,
    replay,
    shell,
    sol,
    unwatchPlay,
    vscode,
    web,
    xml,
    yaml,
    utils,
  }: typeof globals;

  namespace NodeJS {
    interface Global extends Globals {}
  }
}
