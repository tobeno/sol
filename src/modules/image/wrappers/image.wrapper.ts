import type sharp from 'sharp';
import { inspect } from 'util';
import { File } from '../../../wrappers/file.wrapper';
import { Wrapper } from '../../../wrappers/wrapper.wrapper';

export class Image extends Wrapper<Buffer> {
  get buffer(): Buffer {
    return this.value;
  }

  get sharp(): sharp.Sharp {
    const sharp = require('sharp') as typeof import('sharp');

    return sharp(this.value);
  }

  async flip(): Promise<Image> {
    return Image.create(await this.sharp.flip().toBuffer());
  }

  async flop(): Promise<Image> {
    return Image.create(await this.sharp.flop().toBuffer());
  }

  async png(options: sharp.PngOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.png(options).toBuffer());
  }

  async jpeg(options: sharp.JpegOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.jpeg(options).toBuffer());
  }

  async gif(options: sharp.GifOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.gif(options).toBuffer());
  }

  async webp(options: sharp.WebpOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.webp(options).toBuffer());
  }

  async avif(options: sharp.AvifOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.avif(options).toBuffer());
  }

  async tiff(options: sharp.TiffOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.tiff(options).toBuffer());
  }

  async raw(options: sharp.RawOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.raw(options).toBuffer());
  }

  async heif(options: sharp.HeifOptions = {}): Promise<Image> {
    return Image.create(await this.sharp.heif(options).toBuffer());
  }

  async composite(
    others: ({ input: Image } & Omit<sharp.OverlayOptions, 'input'>)[],
  ): Promise<Image> {
    return Image.create(
      await this.sharp
        .composite(
          others.map(({ input, ...otherOverlay }) => ({
            ...(input ? { input: input.value } : {}),
            ...otherOverlay,
          })),
        )
        .toBuffer(),
    );
  }

  async resize(
    width: number,
    height: number,
    options?: sharp.ResizeOptions,
  ): Promise<Image> {
    return Image.create(
      await this.sharp.resize(width, height, options).toBuffer(),
    );
  }

  async extend(options: sharp.ExtendOptions): Promise<Image> {
    return Image.create(await this.sharp.extend(options).toBuffer());
  }

  async trim(options: sharp.TrimOptions): Promise<Image> {
    return Image.create(await this.sharp.trim(options).toBuffer());
  }

  async extract(region: sharp.Region): Promise<Image> {
    return Image.create(await this.sharp.extract(region).toBuffer());
  }

  async rotate(
    angle: number,
    options: sharp.RotateOptions = {},
  ): Promise<Image> {
    return Image.create(await this.sharp.rotate(angle, options).toBuffer());
  }

  async blur(sigma: number | boolean): Promise<Image> {
    return Image.create(await this.sharp.blur(sigma).toBuffer());
  }

  async sharpen(options: sharp.SharpenOptions): Promise<Image> {
    return Image.create(await this.sharp.sharpen(options).toBuffer());
  }

  saveAs(file: File | string): File {
    file = File.create(file);

    file.buffer = this.value;

    return file;
  }

  [inspect.custom](): string {
    return 'Image';
  }

  static create(value: Image | Buffer): Image {
    if (value instanceof Image) {
      return value;
    }

    return new Image(value);
  }
}
