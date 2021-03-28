/*
  eslint-disable no-bitwise,no-mixed-operators,no-param-reassign,no-nested-ternary,no-multi-assign
 */
export default {
  canvas: null,
  context: null,
  initSampleCanvas() {
    if (!this.canvas) {
      const canvas = new OffscreenCanvas(0, 0);
      const context = canvas.getContext('2d');
      this.canvas = canvas;
      this.context = context;
    }
  },
  getSampleCanvas() {
    this.initSampleCanvas();
    return this.canvas;
  },
  getSampleContext() {
    this.initSampleCanvas();
    return this.context;
  },
  createImageData(w, h) {
    this.initSampleCanvas();
    return (this.context.createImageData)
      ? this.context.createImageData(w, h)
      : new ImageData(w, h);
  },
  getImageData(data, w, h) {
    return new ImageData(
      data, w, h,
    );
  },
  buildMap(f) {
    const m = [];
    for (let k = 0; k < 256; k += 1) {
      const v = f(k);
      m[k] = v > 255 ? 255 : v < 0 ? 0 : v | 0;
    }
    return m;
  },
  applyMap(src, dst, map, maskArray) {
    for (let i = 0, l = src.length; i < l; i += 4) {
      const isMask = this.getIsMask(maskArray, i);
      if (!isMask) {
        dst[i] = map[src[i]];
        dst[i + 1] = map[src[i + 1]];
        dst[i + 2] = map[src[i + 2]];
        dst[i + 3] = src[i + 3];
      } else {
        this.copyPixel(dst, src, i);
      }
    }
  },
  mapRGB(src, dst, func, maskArray) {
    this.applyMap(src, dst, this.buildMap(func), maskArray);
  },
  getPixelIndex(x, y, width, height, edge) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      const w = x % width;
      const h = y % height;
      switch (edge) {
        case 1: // clamp
          x = x < 0 ? 0 : x >= width ? width - 1 : x;
          y = y < 0 ? 0 : y >= height ? height - 1 : y;
          break;
        case 2: // wrap
          x = w < 0 ? w + width : w;
          y = h < 0 ? h + height : h;
          break;
        default: // transparent
          return null;
      }
    }
    return (y * width + x) << 2;
  },
  getPixel(src, x, y, width, height, edge) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      const w = x % width;
      const h = y % height;
      switch (edge) {
        case 1: // clamp
          x = x < 0 ? 0 : x >= width ? width - 1 : x;
          y = y < 0 ? 0 : y >= height ? height - 1 : y;
          break;
        case 2: // wrap
          x = w < 0 ? w + width : w;
          y = h < 0 ? h + height : h;
          break;
        default: // transparent
          return 0;
      }
    }
    const i = (y * width + x) << 2;
    // ARGB
    return src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
  },
  /**
   * one of the most important functions in this library.
   * I want to make this as fast as possible.
   */
  copyBilinear(src, x, y, width, height, dst, dstIndex, edge) {
    const fx = x < 0 ? x - 1 | 0 : x | 0; // Math.floor(x)
    const fy = y < 0 ? y - 1 | 0 : y | 0; // Math.floor(y)
    const wx = x - fx;
    const wy = y - fy;
    let i;
    let nw = 0;
    let ne = 0;
    let sw = 0;
    let se = 0;
    if (fx >= 0 && fx < (width - 1) && fy >= 0 && fy < (height - 1)) {
      // in bounds, no edge actions required
      i = (fy * width + fx) << 2;
      if (wx || wy) {
        nw = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
        i += 4;
        ne = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
        i = (i - 8) + (width << 2);
        sw = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
        i += 4;
        se = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
      } else {
        // no interpolation required
        this.copyPixel(dst, src, i, dstIndex);
        return;
      }
    } else {
      // edge actions required
      nw = this.getPixel(src, fx, fy, width, height, edge);
      if (wx || wy) {
        ne = this.getPixel(src, fx + 1, fy, width, height, edge);
        sw = this.getPixel(src, fx, fy + 1, width, height, edge);
        se = this.getPixel(src, fx + 1, fy + 1, width, height, edge);
      } else {
        // no interpolation required
        dst[dstIndex] = nw >> 16 & 0xFF;
        dst[dstIndex + 1] = nw >> 8 & 0xFF;
        dst[dstIndex + 2] = nw & 0xFF;
        dst[dstIndex + 3] = nw >> 24 & 0xFF;
        return;
      }
    }
    const cx = 1 - wx;
    const cy = 1 - wy;
    const r = ((nw >> 16 & 0xFF) * cx + (ne >> 16 & 0xFF) * wx)
      * cy + ((sw >> 16 & 0xFF) * cx + (se >> 16 & 0xFF) * wx) * wy;
    const g = ((nw >> 8 & 0xFF) * cx + (ne >> 8 & 0xFF) * wx)
      * cy + ((sw >> 8 & 0xFF) * cx + (se >> 8 & 0xFF) * wx) * wy;
    const b = ((nw & 0xFF) * cx + (ne & 0xFF) * wx) * cy
      + ((sw & 0xFF) * cx + (se & 0xFF) * wx) * wy;
    const a = ((nw >> 24 & 0xFF) * cx + (ne >> 24 & 0xFF) * wx)
      * cy + ((sw >> 24 & 0xFF) * cx + (se >> 24 & 0xFF) * wx) * wy;
    dst[dstIndex] = r > 255 ? 255 : r < 0 ? 0 : r | 0;
    dst[dstIndex + 1] = g > 255 ? 255 : g < 0 ? 0 : g | 0;
    dst[dstIndex + 2] = b > 255 ? 255 : b < 0 ? 0 : b | 0;
    dst[dstIndex + 3] = a > 255 ? 255 : a < 0 ? 0 : a | 0;
  },
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = (r > g) ? (r > b) ? r : b : (g > b) ? g : b;
    const min = (r < g) ? (r < b) ? r : b : (g < b) ? g : b;
    const chroma = max - min;
    let h = 0;
    let s = 0;
    // Lightness
    const l = (min + max) / 2;
    if (chroma !== 0) {
      // Hue
      if (r === max) {
        h = (g - b) / chroma + ((g < b) ? 6 : 0);
      } else if (g === max) {
        h = (b - r) / chroma + 2;
      } else {
        h = (r - g) / chroma + 4;
      }
      h /= 6;
      // Saturation
      s = (l > 0.5) ? chroma / (2 - max - min) : chroma / (max + min);
    }
    return [h, s, l];
  },
  hslToRgb(h, s, l) {
    let m1;
    let m2;
    let hue;
    let r;
    let g;
    let b;
    let rgb = [];
    if (s === 0) {
      r = g = b = l * 255 + 0.5 | 0;
      rgb = [r, g, b];
    } else {
      if (l <= 0.5) {
        m2 = l * (s + 1);
      } else {
        m2 = l + s - l * s;
      }
      m1 = l * 2 - m2;
      hue = h + 1 / 3;
      let tmp;
      for (let i = 0; i < 3; i += 1) {
        if (hue < 0) {
          hue += 1;
        } else if (hue > 1) {
          hue -= 1;
        }
        if (6 * hue < 1) {
          tmp = m1 + (m2 - m1) * hue * 6;
        } else if (2 * hue < 1) {
          tmp = m2;
        } else if (3 * hue < 2) {
          tmp = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
        } else {
          tmp = m1;
        }
        rgb[i] = tmp * 255 + 0.5 | 0;
        hue -= 1 / 3;
      }
    }
    return rgb;
  },
  rgbToRgba(src) {
    const dst = new Uint8ClampedArray(src.length * 4 / 3);
    for (let i = 0, j = 0; i < src.length; i += 3, j += 1) {
      dst[i + j] = src[i];
      dst[i + j + 1] = src[i + 1];
      dst[i + j + 2] = src[i + 2];
      dst[i + j + 3] = 255;
    }
    return dst;
  },
  rgbaToRgb(src) {
    const dst = new Uint8ClampedArray(src.length * 3 / 4);
    for (let i = 0, j = 0; i < src.length; i += 4, j += 1) {
      dst[i - j] = src[i];
      dst[i - j + 1] = src[i + 1];
      dst[i - j + 2] = src[i + 2];
    }
    return dst;
  },
  getIntensities(srcImageData) {
    const result = new Float32Array(srcImageData.width * srcImageData.height);
    for (let i = 0; i < result.length; i += 1) {
      const index = i * 4;
      // 0.2126 * R + 0.7152 * G + 0.0722 * B
      result[i] = 0.2126 * srcImageData.data[index]
        + 0.7152 * srcImageData.data[index + 1]
        + 0.0722 * srcImageData.data[index + 2];
    }
    return result;
  },
  gaussianKernel(sigma = 1, w = 13, h) {
    const result = {};
    result.w = w;
    result.h = h || w;
    result.kern = new Float32Array(result.w * result.h);
    result.cx = Math.floor(result.w / 2);
    result.cy = Math.floor(result.h / 2);
    result.sigma = sigma;
    for (let y = 0; y < result.h; y += 1) {
      for (let x = 0; x < result.w; x += 1) {
        const rx = (x - result.cx);
        const ry = (y - result.cy);
        const d2 = rx * rx + ry * ry;
        result.kern[y * result.w + x] = this.gaussianVal(d2, sigma);
      }
    }
    return result;
  },
  gaussianVal(d, sigma) {
    return Math.exp(-d / (2 * sigma * sigma));
  },
  gaussianWhats(x, y, kern, cx, cy, w) {
    return kern[(y + cy) * w + x + cx];
  },
  getIsMask(maskArray, index) {
    let isMask = false;
    if (maskArray) {
      isMask = !!maskArray[index / 4];
    }
    return isMask;
  },
  copyPixel(dst, src, index, dstIndex) {
    if (!dstIndex && dstIndex !== 0) {
      dstIndex = index;
    }
    dst[dstIndex] = src[index];
    dst[dstIndex + 1] = src[index + 1];
    dst[dstIndex + 2] = src[index + 2];
    dst[dstIndex + 3] = src[index + 3];
  },
};
