/* eslint-disable no-bitwise */
import {
  BlendSubtract,
  ColorTransformFilter,
  ConvolutionFilter,
  DisplacementMapFilter,
} from '@/utils/effect';

/**
 * @param centerX 0.0 <= n <= 1.0
 * @param centerY 0.0 <= n <= 1.0
 * @param radius
 * @param angle(degree)
 * @param smooth
 */
export default class Rippler {
  constructor(source, strength, scale) {
    this.source = source;
    this.strength = strength;
    this.scaleInv = 1 / scale;
    // create the (downscaled) buffers and final (upscaled) image data, sizes depend on scale
    this.buffer1 = document.createElement('canvas').getContext('2d');
    this.buffer1.canvas.width = source.width * this.scaleInv;
    this.buffer1.canvas.height = source.height * this.scaleInv;
    this.buffer1.fillStyle = '#000000';
    this.buffer1.fillRect(0, 0, this.buffer1.canvas.width, this.buffer1.canvas.height);
    this.buffer2 = document.createElement('canvas').getContext('2d');
    this.buffer2.canvas.width = source.width * this.scaleInv;
    this.buffer2.canvas.height = source.height * this.scaleInv;
    this.defData = document.createElement('canvas').getContext('2d');
    this.defData.canvas.width = source.width;
    this.defData.canvas.height = source.height;
    this.defData.fillStyle = '#7f7f7f';
    this.defData.fillRect(0, 0, source.width, source.height);
    const correctedScaleX = this.defData.canvas.width / this.buffer1.canvas.width;
    const correctedScaleY = this.defData.canvas.height / this.buffer1.canvas.height;
    this.defData.scale(correctedScaleX, correctedScaleY);
    // Create a frame-based loop to update the ripples
    const draw = () => {
      this.handleEnterFrame();
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  drawRipple(x, y, size, alpha) {
    // We need half the size of the ripple
    const half = size >> 1;
    // The colour which will be drawn in the currently active buffer
    const intensity = (alpha * 0xff & 0xff) * alpha;
    // calculate and draw the rectangle, having (x, y) in its centre
    const dx = (-half + x) * this.scaleInv;
    const dy = (-half + y) * this.scaleInv;
    const dw = size * this.scaleInv;
    const dh = dw;
    this.buffer1.fillStyle = `rgb(0, 0, ${intensity})`;
    this.buffer1.fillRect(dx, dy, dw, dh);
  }

  handleEnterFrame() {
    // a temporary clone of buffer 2
    const buffer2Clone = this.buffer2.getImageData(0, 0,
      this.buffer1.canvas.width, this.buffer1.canvas.height);
    // buffer2 will contain an expanded version of buffer1
    const buffer1Image = this.buffer1.getImageData(0, 0,
      this.buffer1.canvas.width, this.buffer1.canvas.height);
    let buffer2Image = ConvolutionFilter(buffer1Image, 3, 3,
      [0.5, 1, 0.5, 1, 0, 1, 0.5, 1, 0.5], 3, 0, false);
    // by substracting buffer2's old image, buffer2 will now be a ring
    buffer2Image = BlendSubtract(buffer2Image, buffer2Clone, 0, 0);
    this.buffer2.putImageData(buffer2Image, 0, 0);
    // scale up and draw to the final displacement map, and apply it to the filter
    this.defData.drawImage(this.buffer2.canvas, 0, 0);
    let defImage = this.defData.getImageData(0, 0,
      this.defData.canvas.width, this.defData.canvas.height);
    defImage = ColorTransformFilter(defImage, 1, 1, 1, 1, 128, 128, 128, 0);
    const result = DisplacementMapFilter(this.source, defImage,
      0, 0, 2, 2, this.strength, this.strength, 2);
    // switch buffers 1 and 2
    this.switchBuffers();
    if (this.onUpdate) {
      this.onUpdate(result);
    }
  }

  switchBuffers() {
    const temp = this.buffer1;
    this.buffer1 = this.buffer2;
    this.buffer2 = temp;
  }
}
