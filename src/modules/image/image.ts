import { Wrapper } from '../data/wrapper';
import type sharp from 'sharp';
import { File } from '../storage/file';
import { inspect } from 'util';

export class Image extends Wrapper<Buffer> {
  get buffer(): Buffer {
    return this.value;
  }

  get sharp(): sharp.Sharp {
    const sharp = require('sharp') as typeof import('sharp');

    return sharp(this.value);
  }

  get flipped(): Image {
    return Image.create(awaitSync(this.sharp.flip().toBuffer()));
  }

  get flopped(): Image {
    return Image.create(awaitSync(this.sharp.flop().toBuffer()));
  }

  png(options: sharp.PngOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.png(options).toBuffer()));
  }

  jpeg(options: sharp.JpegOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.jpeg(options).toBuffer()));
  }

  gif(options: sharp.GifOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.gif(options).toBuffer()));
  }

  webp(options: sharp.WebpOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.webp(options).toBuffer()));
  }

  avif(options: sharp.AvifOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.avif(options).toBuffer()));
  }

  tiff(options: sharp.TiffOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.tiff(options).toBuffer()));
  }

  raw(options: sharp.RawOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.raw(options).toBuffer()));
  }

  heif(options: sharp.HeifOptions = {}): Image {
    return Image.create(awaitSync(this.sharp.heif(options).toBuffer()));
  }

  composite(
    others: ({ input: Image } & Omit<sharp.OverlayOptions, 'input'>)[],
  ): Image {
    return Image.create(
      awaitSync(
        this.sharp
          .composite(
            others.map(({ input, ...otherOverlay }) => ({
              ...(input ? { input: input.value } : {}),
              ...otherOverlay,
            })),
          )
          .toBuffer(),
      ),
    );
  }

  resize(width: number, height: number, options?: sharp.ResizeOptions): Image {
    return Image.create(
      awaitSync(this.sharp.resize(width, height, options).toBuffer()),
    );
  }

  extend(options: sharp.ExtendOptions): Image {
    return Image.create(awaitSync(this.sharp.extend(options).toBuffer()));
  }

  trim(options: sharp.TrimOptions): Image {
    return Image.create(awaitSync(this.sharp.trim(options).toBuffer()));
  }

  extract(region: sharp.Region): Image {
    return Image.create(awaitSync(this.sharp.extract(region).toBuffer()));
  }

  rotate(angle: number, options: sharp.RotateOptions = {}): Image {
    return Image.create(
      awaitSync(this.sharp.rotate(angle, options).toBuffer()),
    );
  }

  blur(sigma: number | boolean): Image {
    return Image.create(awaitSync(this.sharp.blur(sigma).toBuffer()));
  }

  sharpen(options: sharp.SharpenOptions): Image {
    return Image.create(awaitSync(this.sharp.sharpen(options).toBuffer()));
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
