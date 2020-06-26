import { Response } from '../web/response';
import { File } from '../storage/file';
import { Data } from './data';
import { Text } from './text';

export type DataSource = File | Response | Data | Text | Clipboard | any;
