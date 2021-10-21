import type { Response } from '../web/response';
import type { File } from '../storage/file';
import type { Data } from './data';
import type { Text } from './text';

export type DataSource = File | Response | Data | Text | Clipboard | any;
