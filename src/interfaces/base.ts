import { ItemCollection } from '../storage/item-collection';

export interface ClassWithData {
  data: any;
}

export interface ClassWithText {
  text: string;
  data?: any;
  toString?(): string;
}

export interface ClassWithStorageItems {
  items(): ItemCollection;
}

export interface ClassWithUpdateText {
  updateText(updater: (value: string) => string | Promise<string>): string;
}

export interface ClassWithReadonlyText {
  readonly text: string;
}
