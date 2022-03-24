import type { Response } from '../web/response';
import type { File } from '../storage/file';
import type { Data } from './data';
import type { Text } from './text';
import type { Clipboard } from '../os/clipboard';

export type DataSource = File | Response | Data | Text | Clipboard | any;
