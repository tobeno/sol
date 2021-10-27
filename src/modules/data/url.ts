import { Wrapper } from './wrapper';
import { browse } from '../integrations/browser';

export class Url extends Wrapper<string> {
  constructor(value: string) {
    super(value);
  }

  browse(): void {
    browse(this);
  }
}
