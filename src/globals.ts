import { shell, utils, storage, web, data, os } from './index';

export const globals = {
  storage,
  web,
  os,
  data,
  shell,
  utils,
  vscode: shell.vscode,
  play: shell.play,
  clipboard: os.clipboard,
  json: data.json,
  html: data.html,
  file: storage.file,
  dir: storage.dir,
  files: storage.files,
  dirs: storage.dirs,
  grep: storage.grep,
  glob: storage.glob,
  jsonata: data.jsonata,
  cheerio: data.cheerio,
  fetch: web.fetch,
};
