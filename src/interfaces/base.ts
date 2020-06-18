export interface ClassWithData {
  data: any;
}

export interface ClassWithText {
  text: string;
}

export interface ClassWithUpdateText {
  updateText(
    updater: (value: string) => string | Promise<string>,
  ): Promise<void>;
}

export interface ClassWithReadonlyText {
  readonly text: string;
}
