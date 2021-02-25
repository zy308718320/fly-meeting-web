/* eslint-disable
  operator-assignment,
  no-restricted-globals,
  no-bitwise,
  no-mixed-operators,
  no-param-reassign,
  no-nested-ternary,
  no-unused-expressions,
  no-multi-assign,
  no-continue
  */
import helper from './helper';

export function ConvolutionFilter(
  srcImageData, matrixX, matrixY, matrix, divisor,
  bias, preserveAlpha, clamp, color, alpha, maskArray,
) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  divisor = divisor || 1;
  bias = bias || 0;
  // default true
  (preserveAlpha !== false) && (preserveAlpha = true);
  (clamp !== false) && (clamp = true);
  color = color || 0;
  alpha = alpha || 0;
  let index = 0;
  const rows = matrixX >> 1;
  const cols = matrixY >> 1;
  const clampR = color >> 16 & 0xFF;
  const clampG = color >> 8 & 0xFF;
  const clampB = color & 0xFF;
  const clampA = alpha * 0xFF;
  for (let y = 0; y < srcHeight; y += 1) {
    for (let x = 0; x < srcWidth; x += 1, index += 4) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let replace = false;
      let mIndex = 0;
      const isMask = helper.getIsMask(maskArray, index);
      if (!isMask) {
        for (let row = -rows; row <= rows; row += 1) {
          const rowIndex = y + row;
          let offset;
          if (rowIndex >= 0 && rowIndex < srcHeight) {
            offset = rowIndex * srcWidth;
          } else if (clamp) {
            offset = y * srcWidth;
          } else {
            replace = true;
          }
          for (let col = -cols; col <= cols; col += 1) {
            const m = matrix[mIndex];
            mIndex += 1;
            if (m !== 0) {
              let colIndex = x + col;
              if (!(colIndex >= 0 && colIndex < srcWidth)) {
                if (clamp) {
                  colIndex = x;
                } else {
                  replace = true;
                }
              }
              if (replace) {
                r += m * clampR;
                g += m * clampG;
                b += m * clampB;
                a += m * clampA;
              } else {
                const p = (offset + colIndex) << 2;
                r += m * srcPixels[p];
                g += m * srcPixels[p + 1];
                b += m * srcPixels[p + 2];
                a += m * srcPixels[p + 3];
              }
            }
          }
        }
        const rv = r / divisor + bias;
        const gv = g / divisor + bias;
        const bv = b / divisor + bias;
        const av = a / divisor + bias;
        dstPixels[index] = rv > 255 ? 255 : rv < 0 ? 0 : rv | 0;
        dstPixels[index + 1] = gv > 255 ? 255 : gv < 0 ? 0 : gv | 0;
        dstPixels[index + 2] = bv > 255 ? 255 : bv < 0 ? 0 : bv | 0;
        dstPixels[index + 3] = preserveAlpha
          ? srcPixels[index + 3] : av > 255 ? 255 : av < 0 ? 0 : av | 0;
      } else {
        helper.copyPixel(dstPixels, srcPixels, index);
      }
    }
  }
  return dstImageData;
}

export function Copy(srcImageData, dstImageData) {
  const srcPixels = srcImageData.data;
  let srcLength = srcPixels.length;
  const dstPixels = dstImageData.data;
  while (srcLength) {
    srcLength -= 1;
    dstPixels[srcLength] = srcPixels[srcLength];
  }
  return dstImageData;
}

export function Clone(srcImageData) {
  return Copy(srcImageData, helper.createImageData(srcImageData.width, srcImageData.height));
}

export function ColorMatrixFilter(srcImageData, matrix, maskArray) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  const m0 = matrix[0];
  const m1 = matrix[1];
  const m2 = matrix[2];
  const m3 = matrix[3];
  const m4 = matrix[4];
  const m5 = matrix[5];
  const m6 = matrix[6];
  const m7 = matrix[7];
  const m8 = matrix[8];
  const m9 = matrix[9];
  const m10 = matrix[10];
  const m11 = matrix[11];
  const m12 = matrix[12];
  const m13 = matrix[13];
  const m14 = matrix[14];
  const m15 = matrix[15];
  const m16 = matrix[16];
  const m17 = matrix[17];
  const m18 = matrix[18];
  const m19 = matrix[19];
  let i;
  let r;
  let g;
  let b;
  let a;
  for (i = 0; i < srcLength; i += 4) {
    r = srcPixels[i];
    g = srcPixels[i + 1];
    b = srcPixels[i + 2];
    a = srcPixels[i + 3];
    const rv = r * m0 + g * m1 + b * m2 + a * m3 + m4;
    const gv = r * m5 + g * m6 + b * m7 + a * m8 + m9;
    const bv = r * m10 + g * m11 + b * m12 + a * m13 + m14;
    const av = r * m15 + g * m16 + b * m17 + a * m18 + m19;
    const isMask = helper.getIsMask(maskArray, i);
    if (!isMask) {
      dstPixels[i] = rv > 255 ? 255 : rv < 0 ? 0 : rv | 0;
      dstPixels[i + 1] = gv > 255 ? 255 : gv < 0 ? 0 : gv | 0;
      dstPixels[i + 2] = bv > 255 ? 255 : bv < 0 ? 0 : bv | 0;
      dstPixels[i + 3] = av > 255 ? 255 : av < 0 ? 0 : av | 0;
    } else {
      helper.copyPixel(dstPixels, srcPixels, i);
    }
  }
  return dstImageData;
}

/**
 * @param srcImageData
 * @param threshold 0.0 <= n <= 1.0
 * @param maskArray
 */
export function Binarize(srcImageData, threshold, maskArray) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  if (isNaN(threshold)) {
    threshold = 0.5;
  }
  threshold *= 255;
  for (let i = 0; i < srcLength; i += 4) {
    const isMask = helper.getIsMask(maskArray, i);
    if (!isMask) {
      const avg = srcPixels[i] + srcPixels[i + 1] + srcPixels[i + 2] / 3;
      dstPixels[i] = dstPixels[i + 1] = dstPixels[i + 2] = avg <= threshold ? 0 : 255;
      dstPixels[i + 3] = 255;
    } else {
      helper.copyPixel(dstPixels, srcPixels, i);
    }
  }
  return dstImageData;
}

export function BlendAdd(srcImageData, blendImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  const blendPixels = blendImageData.data;
  for (let i = 0; i < srcLength; i += 4) {
    const rv = srcPixels[i] + blendPixels[i];
    const gv = srcPixels[i + 1] + blendPixels[i + 1];
    const bv = srcPixels[i + 2] + blendPixels[i + 2];
    dstPixels[i] = rv > 255 ? 255 : rv;
    dstPixels[i + 1] = gv > 255 ? 255 : gv;
    dstPixels[i + 2] = bv > 255 ? 255 : bv;
    dstPixels[i + 3] = 255;
  }
  return dstImageData;
}

export function BlendSubtract(srcImageData, blendImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  const blendPixels = blendImageData.data;
  for (let i = 0; i < srcLength; i += 4) {
    const rv = srcPixels[i] - blendPixels[i];
    const gv = srcPixels[i + 1] - blendPixels[i + 1];
    const bv = srcPixels[i + 2] - blendPixels[i + 2];
    dstPixels[i] = rv < 0 ? 0 : rv;
    dstPixels[i + 1] = gv < 0 ? 0 : gv;
    dstPixels[i + 2] = bv < 0 ? 0 : bv;
    dstPixels[i + 3] = 255;
  }
  return dstImageData;
}

/**
 * Algorithm based on BoxBlurFilter.java by Huxtable.com
 * @see http://www.jhlabs.com/ip/blurring.html
 * Copyright 2005 Huxtable.com. All rights reserved.
 */
export function BoxBlur(srcImageData, hRadius, vRadius, quality) {
  function blur(src, dst, width, height, radius) {
    const tableSize = radius * 2 + 1;
    const radiusPlus1 = radius + 1;
    const widthMinus1 = width - 1;
    let r;
    let g;
    let b;
    let a;
    let srcIndex = 0;
    let dstIndex;
    let p;
    let next;
    let prev;
    let i;
    let l;
    let x;
    let y;
    let nextIndex;
    let prevIndex;
    const sumTable = [];
    for (i = 0, l = 256 * tableSize; i < l; i += 1) {
      sumTable[i] = i / tableSize | 0;
    }
    for (y = 0; y < height; y += 1) {
      r = g = b = a = 0;
      dstIndex = y;
      p = srcIndex << 2;
      r += radiusPlus1 * src[p];
      g += radiusPlus1 * src[p + 1];
      b += radiusPlus1 * src[p + 2];
      a += radiusPlus1 * src[p + 3];
      for (i = 1; i <= radius; i += 1) {
        p = (srcIndex + (i < width ? i : widthMinus1)) << 2;
        r += src[p];
        g += src[p + 1];
        b += src[p + 2];
        a += src[p + 3];
      }
      for (x = 0; x < width; x += 1) {
        p = dstIndex << 2;
        dst[p] = sumTable[r];
        dst[p + 1] = sumTable[g];
        dst[p + 2] = sumTable[b];
        dst[p + 3] = sumTable[a];
        nextIndex = x + radiusPlus1;
        if (nextIndex > widthMinus1) {
          nextIndex = widthMinus1;
        }
        prevIndex = x - radius;
        if (prevIndex < 0) {
          prevIndex = 0;
        }
        next = (srcIndex + nextIndex) << 2;
        prev = (srcIndex + prevIndex) << 2;
        r += src[next] - src[prev];
        g += src[next + 1] - src[prev + 1];
        b += src[next + 2] - src[prev + 2];
        a += src[next + 3] - src[prev + 3];
        dstIndex += height;
      }
      srcIndex += width;
    }
  }
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  const tmpImageData = helper.createImageData(srcWidth, srcHeight);
  const tmpPixels = tmpImageData.data;
  for (let i = 0; i < quality; i += 1) {
    // only use the srcPixels on the first loop
    blur(i ? dstPixels : srcPixels, tmpPixels, srcWidth, srcHeight, hRadius);
    blur(tmpPixels, dstPixels, srcHeight, srcWidth, vRadius);
  }
  return dstImageData;
}

/**
 * @ param strength 1 <= n <= 4
 */
export function GaussianBlur(srcImageData, strength, maskArray) {
  let size;
  let matrix;
  let divisor;
  switch (strength) {
    case 2:
      size = 5;
      matrix = [
        1, 1, 2, 1, 1,
        1, 2, 4, 2, 1,
        2, 4, 8, 4, 2,
        1, 2, 4, 2, 1,
        1, 1, 2, 1, 1,
      ];
      divisor = 52;
      break;
    case 3:
      size = 7;
      matrix = [
        1, 1, 2, 2, 2, 1, 1,
        1, 2, 2, 4, 2, 2, 1,
        2, 2, 4, 8, 4, 2, 2,
        2, 4, 8, 16, 8, 4, 2,
        2, 2, 4, 8, 4, 2, 2,
        1, 2, 2, 4, 2, 2, 1,
        1, 1, 2, 2, 2, 1, 1,
      ];
      divisor = 140;
      break;
    case 4:
      size = 15;
      matrix = [
        2, 2, 3, 4, 5, 5, 6, 6, 6, 5, 5, 4, 3, 2, 2,
        2, 3, 4, 5, 7, 7, 8, 8, 8, 7, 7, 5, 4, 3, 2,
        3, 4, 6, 7, 9, 10, 10, 11, 10, 10, 9, 7, 6, 4, 3,
        4, 5, 7, 9, 10, 12, 13, 13, 13, 12, 10, 9, 7, 5, 4,
        5, 7, 9, 11, 13, 14, 15, 16, 15, 14, 13, 11, 9, 7, 5,
        5, 7, 10, 12, 14, 16, 17, 18, 17, 16, 14, 12, 10, 7, 5,
        6, 8, 10, 13, 15, 17, 19, 19, 19, 17, 15, 13, 10, 8, 6,
        6, 8, 11, 13, 16, 18, 19, 20, 19, 18, 16, 13, 11, 8, 6,
        6, 8, 10, 13, 15, 17, 19, 19, 19, 17, 15, 13, 10, 8, 6,
        5, 7, 10, 12, 14, 16, 17, 18, 17, 16, 14, 12, 10, 7, 5,
        5, 7, 9, 11, 13, 14, 15, 16, 15, 14, 13, 11, 9, 7, 5,
        4, 5, 7, 9, 10, 12, 13, 13, 13, 12, 10, 9, 7, 5, 4,
        3, 4, 6, 7, 9, 10, 10, 11, 10, 10, 9, 7, 6, 4, 3,
        2, 3, 4, 5, 7, 7, 8, 8, 8, 7, 7, 5, 4, 3, 2,
        2, 2, 3, 4, 5, 5, 6, 6, 6, 5, 5, 4, 3, 2, 2,
      ];
      divisor = 2044;
      break;
    default:
      size = 3;
      matrix = [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1,
      ];
      divisor = 16;
      break;
  }
  return ConvolutionFilter(srcImageData, size, size, matrix, divisor, 0, false, null, null, null, maskArray);
}

/**
 * Stack Blur Algorithm by Mario Klingemann <mario@quasimondo.com>
 * @see http://incubator.quasimondo.com/processing/fast_blur_deluxe.php
 */
/*
Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
export function StackBlur(srcImageData, radius) {
  const mulTable = [
    512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
    454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
    482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
    437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
    497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
    320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
    446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
    329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
    505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
    399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
    324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
    268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
    451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
    385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
    332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
    289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
  const shgTable = [
    9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
    17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
    19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
    21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
    22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
    23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
  function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  }
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = Clone(srcImageData);
  const dstPixels = dstImageData.data;
  let x;
  let y;
  let i;
  let p;
  let yp;
  let yi;
  let yw;
  let rSum;
  let gSum;
  let bSum;
  let aSum;
  let rOutSum;
  let gOutSum;
  let bOutSum;
  let aOutSum;
  let rInSum;
  let gInSum;
  let bInSum;
  let aInSum;
  let pr;
  let pg;
  let pb;
  let pa;
  let rbs;
  const div = radius + radius + 1;
  const widthMinus1 = srcWidth - 1;
  const heightMinus1 = srcHeight - 1;
  const radiusPlus1 = radius + 1;
  const sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  const stackStart = new BlurStack();
  let stack = stackStart;
  let stackIn;
  let stackOut;
  let stackEnd;
  const mulSum = mulTable[radius];
  const shgSum = shgTable[radius];
  for (i = 1; i < div; i += 1) {
    stack = stack.next = new BlurStack();
    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }
  stack.next = stackStart;
  yw = yi = 0;
  for (y = 0; y < srcHeight; y += 1) {
    rInSum = gInSum = bInSum = aInSum = rSum = gSum = bSum = aSum = 0;
    rOutSum = radiusPlus1 * (pr = dstPixels[yi]);
    gOutSum = radiusPlus1 * (pg = dstPixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = dstPixels[yi + 2]);
    aOutSum = radiusPlus1 * (pa = dstPixels[yi + 3]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;
    stack = stackStart;
    for (i = 0; i < radiusPlus1; i += 1) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }
    for (i = 1; i < radiusPlus1; i += 1) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = (pr = dstPixels[p])) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = (pg = dstPixels[p + 1])) * rbs;
      bSum += (stack.b = (pb = dstPixels[p + 2])) * rbs;
      aSum += (stack.a = (pa = dstPixels[p + 3])) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;
      stack = stack.next;
    }
    stackIn = stackStart;
    stackOut = stackEnd;
    for (x = 0; x < srcWidth; x += 1) {
      const z = x + radius + 1;
      dstPixels[yi] = (rSum * mulSum) >> shgSum;
      dstPixels[yi + 1] = (gSum * mulSum) >> shgSum;
      dstPixels[yi + 2] = (bSum * mulSum) >> shgSum;
      dstPixels[yi + 3] = (aSum * mulSum) >> shgSum;
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      p = (yw + (z < widthMinus1 ? z : widthMinus1)) << 2;
      rInSum += (stackIn.r = dstPixels[p]);
      gInSum += (stackIn.g = dstPixels[p + 1]);
      bInSum += (stackIn.b = dstPixels[p + 2]);
      aInSum += (stackIn.a = dstPixels[p + 3]);
      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      aSum += aInSum;
      stackIn = stackIn.next;
      rOutSum += (pr = stackOut.r);
      gOutSum += (pg = stackOut.g);
      bOutSum += (pb = stackOut.b);
      aOutSum += (pa = stackOut.a);
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;
      stackOut = stackOut.next;
      yi += 4;
    }
    yw += srcWidth;
  }
  for (x = 0; x < srcWidth; x += 1) {
    gInSum = bInSum = aInSum = rInSum = gSum = bSum = aSum = rSum = 0;
    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = dstPixels[yi]);
    gOutSum = radiusPlus1 * (pg = dstPixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = dstPixels[yi + 2]);
    aOutSum = radiusPlus1 * (pa = dstPixels[yi + 3]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;
    stack = stackStart;
    for (i = 0; i < radiusPlus1; i += 1) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }
    yp = srcWidth;
    for (i = 1; i <= radius; i += 1) {
      yi = (yp + x) << 2;
      rSum += (stack.r = (pr = dstPixels[yi])) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = (pg = dstPixels[yi + 1])) * rbs;
      bSum += (stack.b = (pb = dstPixels[yi + 2])) * rbs;
      aSum += (stack.a = (pa = dstPixels[yi + 3])) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;
      stack = stack.next;
      if (i < heightMinus1) {
        yp += srcWidth;
      }
    }
    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for (y = 0; y < srcHeight; y += 1) {
      const z = y + radiusPlus1;
      p = yi << 2;
      dstPixels[p] = (rSum * mulSum) >> shgSum;
      dstPixels[p + 1] = (gSum * mulSum) >> shgSum;
      dstPixels[p + 2] = (bSum * mulSum) >> shgSum;
      dstPixels[p + 3] = (aSum * mulSum) >> shgSum;
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      p = (x + ((z < heightMinus1 ? z : heightMinus1) * srcWidth)) << 2;
      rSum += (rInSum += (stackIn.r = dstPixels[p]));
      gSum += (gInSum += (stackIn.g = dstPixels[p + 1]));
      bSum += (bInSum += (stackIn.b = dstPixels[p + 2]));
      aSum += (aInSum += (stackIn.a = dstPixels[p + 3]));
      stackIn = stackIn.next;
      rOutSum += (pr = stackOut.r);
      gOutSum += (pg = stackOut.g);
      bOutSum += (pb = stackOut.b);
      aOutSum += (pa = stackOut.a);
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;
      stackOut = stackOut.next;
      yi += srcWidth;
    }
  }
  return dstImageData;
}

/**
 * TV based algorithm
 */
export function Brightness(srcImageData, brightness) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  helper.mapRGB(srcPixels, dstPixels, (value) => {
    value += brightness;
    return (value > 255) ? 255 : value;
  });
  return dstImageData;
}

/**
 * GIMP algorithm modified. pretty close to fireworks
 * @param brightness -100 <= n <= 100
 * @param contrast -100 <= n <= 100
 */
export function BrightnessContrastGimp(srcImageData, brightness, contrast) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  const p4 = Math.PI / 4;
  // fix to -1 <= n <= 1
  brightness /= 100;
  // fix to -99 <= n <= 99
  contrast *= 0.99;
  // fix to -1 < n < 1
  contrast /= 100;
  // apply GIMP formula
  contrast = Math.tan((contrast + 1) * p4);
  // get the average color
  let avg = 0;
  for (let i = 0; i < srcLength; i += 4) {
    avg += (srcPixels[i] * 19595 + srcPixels[i + 1] * 38470 + srcPixels[i + 2] * 7471) >> 16;
  }
  avg /= (srcLength / 4);
  helper.mapRGB(srcPixels, dstPixels, (value) => {
    if (brightness < 0) {
      value *= (1 + brightness);
    } else if (brightness > 0) {
      value += ((255 - value) * brightness);
    }
    // value += brightness;

    if (contrast !== 0) {
      value = (value - avg) * contrast + avg;
    }
    return value + 0.5 | 0;
  });
  return dstImageData;
}

/**
 * more like the new photoshop algorithm
 * @param srcImageData
 * @param brightness -100 <= n <= 100
 * @param contrast -100 <= n <= 100
 */
export function BrightnessContrastPhotoshop(srcImageData, brightness, contrast) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  brightness = (brightness + 100) / 100;
  contrast = (contrast + 100) / 100;
  helper.mapRGB(srcPixels, dstPixels, (value) => {
    value *= brightness;
    value = (value - 127.5) * contrast + 127.5;
    return value + 0.5 | 0;
  });
  return dstImageData;
}

export function Channels(srcImageData, channel, maskArray) {
  let matrix;
  switch (channel) {
    case 2: // green
      matrix = [
        0, 1, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 0, 1, 0,
      ];
      break;
    case 3: // blue
      matrix = [
        0, 0, 1, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0,
      ];
      break;
    default: // red
      matrix = [
        1, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 1, 0,
      ];
      break;
  }
  return ColorMatrixFilter(srcImageData, matrix, maskArray);
}

/**
 * slower
 */
export function CloneBuiltin(srcImageData) {
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const canvas = helper.getSampleCanvas();
  const context = helper.getSampleContext();
  canvas.width = srcWidth;
  canvas.height = srcHeight;
  context.putImageData(srcImageData, 0, 0);
  const dstImageData = context.getImageData(0, 0, srcWidth, srcHeight);
  canvas.width = 0;
  canvas.height = 0;
  return dstImageData;
}

export function ColorTransformFilter(
  srcImageData, redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier,
  redOffset, greenOffset, blueOffset, alphaOffset, maskArray,
) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  let i;
  for (i = 0; i < srcLength; i += 4) {
    const rv = srcPixels[i] * redMultiplier + redOffset;
    const gv = srcPixels[i + 1] * greenMultiplier + greenOffset;
    const bv = srcPixels[i + 2] * blueMultiplier + blueOffset;
    const av = srcPixels[i + 3] * alphaMultiplier + alphaOffset;
    const isMask = helper.getIsMask(maskArray, i);
    if (!isMask) {
      dstPixels[i] = rv > 255 ? 255 : rv < 0 ? 0 : rv;
      dstPixels[i + 1] = gv > 255 ? 255 : gv < 0 ? 0 : gv;
      dstPixels[i + 2] = bv > 255 ? 255 : bv < 0 ? 0 : bv;
      dstPixels[i + 3] = av > 255 ? 255 : av < 0 ? 0 : av;
    } else {
      helper.copyPixel(dstPixels, srcPixels, i);
    }
  }
  return dstImageData;
}

export function Crop(srcImageData, x, y, width, height) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(width, height);
  const dstPixels = dstImageData.data;
  const srcLeft = Math.max(x, 0);
  const srcTop = Math.max(y, 0);
  const srcRight = Math.min(x + width, srcWidth);
  const srcBottom = Math.min(y + height, srcHeight);
  const dstLeft = srcLeft - x;
  const dstTop = srcTop - y;
  let srcRow;
  let srcCol;
  let dstCol;
  let dstRow;
  let srcIndex;
  let dstIndex;
  for (srcRow = srcTop, dstRow = dstTop; srcRow < srcBottom; srcRow += 1, dstRow += 1) {
    for (srcCol = srcLeft, dstCol = dstLeft; srcCol < srcRight; srcCol += 1, dstCol += 1) {
      srcIndex = (srcRow * srcWidth + srcCol) << 2;
      dstIndex = (dstRow * width + dstCol) << 2;
      helper.copyPixel(dstPixels, srcPixels, srcIndex, dstIndex);
    }
  }
  return dstImageData;
}

export function CropBuiltin(srcImageData, x, y, width, height) {
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const canvas = helper.getSampleCanvas();
  const context = helper.getSampleContext();
  canvas.width = srcWidth;
  canvas.height = srcHeight;
  context.putImageData(srcImageData, 0, 0);
  const result = context.getImageData(x, y, width, height);
  canvas.width = 0;
  canvas.height = 0;
  return result;
}

/**
 * sets to the average of the highest and lowest contrast
 */
export function Desaturate(srcImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  for (let i = 0; i < srcLength; i += 4) {
    const r = srcPixels[i];
    const g = srcPixels[i + 1];
    const b = srcPixels[i + 2];
    const max = (r > g) ? (r > b) ? r : b : (g > b) ? g : b;
    const min = (r < g) ? (r < b) ? r : b : (g < b) ? g : b;
    const avg = ((max + min) / 2) + 0.5 | 0;

    dstPixels[i] = dstPixels[i + 1] = dstPixels[i + 2] = avg;
    dstPixels[i + 3] = srcPixels[i + 3];
  }
  return dstImageData;
}

/**
 * TODO: use bilinear
 */
export function DisplacementMapFilter(
  srcImageData, mapImageData, mapX, mapY,
  componentX, componentY, scaleX, scaleY, mode,
) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = Clone(srcImageData);
  const dstPixels = dstImageData.data;
  mapX || (mapX = 0);
  mapY || (mapY = 0);
  componentX || (componentX = 0); // red?
  componentY || (componentY = 0);
  scaleX || (scaleX = 0);
  scaleY || (scaleY = 0);
  mode || (mode = 2); // wrap
  const mapWidth = mapImageData.width;
  const mapHeight = mapImageData.height;
  const mapPixels = mapImageData.data;
  const mapRight = mapWidth + mapX;
  const mapBottom = mapHeight + mapY;
  let dstIndex;
  let srcIndex;
  let mapIndex;
  let cx;
  let cy;
  let tx;
  let ty;
  let x;
  let y;
  for (x = 0; x < srcWidth; x += 1) {
    for (y = 0; y < srcHeight; y += 1) {
      dstIndex = (y * srcWidth + x) << 2;
      if (x < mapX || y < mapY || x >= mapRight || y >= mapBottom) {
        // out of the map bounds
        // copy src to dst
        srcIndex = dstIndex;
      } else {
        // apply map
        mapIndex = ((y - mapY) * mapWidth + (x - mapX)) << 2;
        // tx = x + ((componentX(x, y) - 128) * scaleX) / 256
        cx = mapPixels[mapIndex + componentX];
        tx = x + (((cx - 128) * scaleX) >> 8);
        // tx = y + ((componentY(x, y) - 128) * scaleY) / 256
        cy = mapPixels[mapIndex + componentY];
        ty = y + (((cy - 128) * scaleY) >> 8);
        srcIndex = helper.getPixelIndex(tx + 0.5 | 0, ty + 0.5 | 0, srcWidth, srcHeight, mode);
        if (srcIndex === null) {
          // if mode == ignore and (tx,ty) is out of src bounds
          // then copy (x,y) to dst
          srcIndex = dstIndex;
        }
      }
      helper.copyPixel(dstPixels, srcPixels, srcIndex, dstIndex);
    }
  }
  return dstImageData;
}

/**
 * Floyd-Steinberg algorithm
 * @param levels 2 <= n <= 255
 */
export function Dither(srcImageData, levels) {
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = Clone(srcImageData);
  const dstPixels = dstImageData.data;
  levels = levels < 2 ? 2 : levels > 255 ? 255 : levels;
  // Build a color map using the same algorithm as the posterize filter.
  const levelMap = [];
  const levelsMinus1 = levels - 1;
  let j = 0;
  let k = 0;
  let i;
  for (i = 0; i < levels; i += 1) {
    levelMap[i] = (255 * i) / levelsMinus1;
  }
  const posterize = helper.buildMap(() => {
    const ret = levelMap[j];
    k += levels;
    if (k > 255) {
      k -= 255;
      j += 1;
    }
    return ret;
  });
  // Apply the dithering algorithm to each pixel
  let x;
  let y;
  let index;
  let oldR;
  let oldG;
  let oldB;
  let newR;
  let newG;
  let newB;
  let errR;
  let errG;
  let errB;
  let nbrR;
  let nbrG;
  let nbrB;
  const srcWidthMinus1 = srcWidth - 1;
  const srcHeightMinus1 = srcHeight - 1;
  const A = 7 / 16;
  const B = 3 / 16;
  const C = 5 / 16;
  const D = 1 / 16;
  for (y = 0; y < srcHeight; y += 1) {
    for (x = 0; x < srcWidth; x += 1) {
      // Get the current pixel.
      index = (y * srcWidth + x) << 2;
      oldR = dstPixels[index];
      oldG = dstPixels[index + 1];
      oldB = dstPixels[index + 2];
      // Quantize using the color map
      newR = posterize[oldR];
      newG = posterize[oldG];
      newB = posterize[oldB];
      // Set the current pixel.
      dstPixels[index] = newR;
      dstPixels[index + 1] = newG;
      dstPixels[index + 2] = newB;
      // Quantization errors
      errR = oldR - newR;
      errG = oldG - newG;
      errB = oldB - newB;
      // Apply the matrix.
      // x + 1, y
      index += 1 << 2;
      if (x < srcWidthMinus1) {
        nbrR = dstPixels[index] + A * errR;
        nbrG = dstPixels[index + 1] + A * errG;
        nbrB = dstPixels[index + 2] + A * errB;
        dstPixels[index] = nbrR > 255 ? 255 : nbrR < 0 ? 0 : nbrR | 0;
        dstPixels[index + 1] = nbrG > 255 ? 255 : nbrG < 0 ? 0 : nbrG | 0;
        dstPixels[index + 2] = nbrB > 255 ? 255 : nbrB < 0 ? 0 : nbrB | 0;
      }
      // x - 1, y + 1
      index += (srcWidth - 2) << 2;
      if (x > 0 && y < srcHeightMinus1) {
        nbrR = dstPixels[index] + B * errR;
        nbrG = dstPixels[index + 1] + B * errG;
        nbrB = dstPixels[index + 2] + B * errB;
        dstPixels[index] = nbrR > 255 ? 255 : nbrR < 0 ? 0 : nbrR | 0;
        dstPixels[index + 1] = nbrG > 255 ? 255 : nbrG < 0 ? 0 : nbrG | 0;
        dstPixels[index + 2] = nbrB > 255 ? 255 : nbrB < 0 ? 0 : nbrB | 0;
      }
      // x, y + 1
      index += 1 << 2;
      if (y < srcHeightMinus1) {
        nbrR = dstPixels[index] + C * errR;
        nbrG = dstPixels[index + 1] + C * errG;
        nbrB = dstPixels[index + 2] + C * errB;
        dstPixels[index] = nbrR > 255 ? 255 : nbrR < 0 ? 0 : nbrR | 0;
        dstPixels[index + 1] = nbrG > 255 ? 255 : nbrG < 0 ? 0 : nbrG | 0;
        dstPixels[index + 2] = nbrB > 255 ? 255 : nbrB < 0 ? 0 : nbrB | 0;
      }
      // x + 1, y + 1
      index += 1 << 2;
      if (x < srcWidthMinus1 && y < srcHeightMinus1) {
        nbrR = dstPixels[index] + D * errR;
        nbrG = dstPixels[index + 1] + D * errG;
        nbrB = dstPixels[index + 2] + D * errB;
        dstPixels[index] = nbrR > 255 ? 255 : nbrR < 0 ? 0 : nbrR | 0;
        dstPixels[index + 1] = nbrG > 255 ? 255 : nbrG < 0 ? 0 : nbrG | 0;
        dstPixels[index + 2] = nbrB > 255 ? 255 : nbrB < 0 ? 0 : nbrB | 0;
      }
    }
  }
  return dstImageData;
}

export function Edge(srcImageData) {
  // pretty close to Fireworks 'Find Edges' effect
  return ConvolutionFilter(srcImageData, 3, 3, [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1,
  ]);
}

export function Emboss(srcImageData) {
  return ConvolutionFilter(srcImageData, 3, 3, [
    -2, -1, 0,
    -1, 1, 1,
    0, 1, 2,
  ]);
}

export function Enrich(srcImageData) {
  return ConvolutionFilter(srcImageData, 3, 3, [
    0, -2, 0,
    -2, 20, -2,
    0, -2, 0,
  ], 10, -40);
}

export function Flip(srcImageData, vertical) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  let x;
  let y;
  let srcIndex;
  let dstIndex;
  for (y = 0; y < srcHeight; y += 1) {
    for (x = 0; x < srcWidth; x += 1) {
      srcIndex = (y * srcWidth + x) << 2;
      if (vertical) {
        dstIndex = ((srcHeight - y - 1) * srcWidth + x) << 2;
      } else {
        dstIndex = (y * srcWidth + (srcWidth - x - 1)) << 2;
      }
      helper.copyPixel(dstPixels, srcPixels, srcIndex, dstIndex);
    }
  }
  return dstImageData;
}

export function Gamma(srcImageData, gamma) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  helper.mapRGB(srcPixels, dstPixels, (value) => {
    value = 255 * ((value / 255) ** (1 / gamma)) + 0.5;
    return value > 255 ? 255 : value + 0.5 | 0;
  });
  return dstImageData;
}

export function GrayScale(srcImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  for (let i = 0; i < srcLength; i += 4) {
    const intensity = (srcPixels[i] * 19595 + srcPixels[i + 1]
      * 38470 + srcPixels[i + 2] * 7471) >> 16;
    dstPixels[i] = dstPixels[i + 1] = dstPixels[i + 2] = intensity;
    dstPixels[i + 3] = srcPixels[i + 3];
  }
  return dstImageData;
}

/**
 * @param hueDelta  -180 <= n <= 180
 * @param satDelta  -100 <= n <= 100
 * @param lightness -100 <= n <= 100
 */
export function HSLAdjustment(srcImageData, hueDelta, satDelta, lightness) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  hueDelta /= 360;
  satDelta /= 100;
  lightness /= 100;
  const { rgbToHsl, hslToRgb } = helper;
  let h;
  let s;
  let hsl;
  let rgb;
  let i;
  for (i = 0; i < srcLength; i += 4) {
    // convert to HSL
    hsl = rgbToHsl(srcPixels[i], srcPixels[i + 1], srcPixels[i + 2]);
    // hue
    h = hsl[0] + hueDelta;
    while (h < 0) {
      h += 1;
    }
    while (h > 1) {
      h -= 1;
    }
    // saturation
    s = hsl[1] + hsl[1] * satDelta;
    if (s < 0) {
      s = 0;
    } else if (s > 1) {
      s = 1;
    }
    // lightness
    let l = hsl[2];
    if (lightness > 0) {
      l += (1 - l) * lightness;
    } else if (lightness < 0) {
      l += l * lightness;
    }
    // convert back to rgb
    rgb = hslToRgb(h, s, l);
    const [r, g, b] = rgb;
    dstPixels[i] = r;
    dstPixels[i + 1] = g;
    dstPixels[i + 2] = b;
    dstPixels[i + 3] = srcPixels[i + 3];
  }
  return dstImageData;
}

export function Invert(srcImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  helper.mapRGB(srcPixels, dstPixels, (value) => 255 - value);
  return dstImageData;
}

export function Mosaic(srcImageData, blockSize, maskArray) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  const cols = Math.ceil(srcWidth / blockSize);
  const rows = Math.ceil(srcHeight / blockSize);
  let row;
  let col;
  let xStart;
  let xEnd;
  let yStart;
  let yEnd;
  let x;
  let y;
  let yIndex;
  let index;
  let size;
  let r;
  let g;
  let b;
  let a;
  for (row = 0; row < rows; row += 1) {
    yStart = row * blockSize;
    yEnd = yStart + blockSize;
    if (yEnd > srcHeight) {
      yEnd = srcHeight;
    }
    for (col = 0; col < cols; col += 1) {
      xStart = col * blockSize;
      xEnd = xStart + blockSize;
      if (xEnd > srcWidth) {
        xEnd = srcWidth;
      }
      // get the average color from the src
      r = g = b = a = 0;
      size = (xEnd - xStart) * (yEnd - yStart);
      for (y = yStart; y < yEnd; y += 1) {
        yIndex = y * srcWidth;
        for (x = xStart; x < xEnd; x += 1) {
          index = (yIndex + x) << 2;
          r += srcPixels[index];
          g += srcPixels[index + 1];
          b += srcPixels[index + 2];
          a += srcPixels[index + 3];
        }
      }
      r = (r / size) + 0.5 | 0;
      g = (g / size) + 0.5 | 0;
      b = (b / size) + 0.5 | 0;
      a = (a / size) + 0.5 | 0;
      // fill the dst with that color
      for (y = yStart; y < yEnd; y += 1) {
        yIndex = y * srcWidth;
        for (x = xStart; x < xEnd; x += 1) {
          index = (yIndex + x) << 2;
          const isMask = helper.getIsMask(maskArray, index);
          if (!isMask) {
            dstPixels[index] = r;
            dstPixels[index + 1] = g;
            dstPixels[index + 2] = b;
            dstPixels[index + 3] = a;
          } else {
            helper.copyPixel(dstPixels, srcPixels, index);
          }
        }
      }
    }
  }
  return dstImageData;
}

/**
 * @param range  1 <= n <= 5
 * @param levels 1 <= n <= 256
 */
export function Oil(srcImageData, range, levels) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  let index = 0;
  const rh = [];
  const gh = [];
  const bh = [];
  const rt = [];
  const gt = [];
  const bt = [];
  let x;
  let y;
  let i;
  let row;
  let col;
  let rowIndex;
  let colIndex;
  let offset;
  let srcIndex;
  let sr;
  let sg;
  let sb;
  let ri;
  let gi;
  let bi;
  let r;
  let g;
  let b;
  for (y = 0; y < srcHeight; y += 1) {
    for (x = 0; x < srcWidth; x += 1) {
      for (i = 0; i < levels; i += 1) {
        rh[i] = gh[i] = bh[i] = rt[i] = gt[i] = bt[i] = 0;
      }
      for (row = -range; row <= range; row += 1) {
        rowIndex = y + row;
        if (rowIndex < 0 || rowIndex >= srcHeight) {
          continue;
        }
        offset = rowIndex * srcWidth;
        for (col = -range; col <= range; col += 1) {
          colIndex = x + col;
          if (colIndex < 0 || colIndex >= srcWidth) {
            continue;
          }
          srcIndex = (offset + colIndex) << 2;
          sr = srcPixels[srcIndex];
          sg = srcPixels[srcIndex + 1];
          sb = srcPixels[srcIndex + 2];
          ri = (sr * levels) >> 8;
          gi = (sg * levels) >> 8;
          bi = (sb * levels) >> 8;
          rt[ri] += sr;
          gt[gi] += sg;
          bt[bi] += sb;
          rh[ri] += 1;
          gh[gi] += 1;
          bh[bi] += 1;
        }
      }
      r = g = b = 0;
      for (i = 1; i < levels; i += 1) {
        if (rh[i] > rh[r]) {
          r = i;
        }
        if (gh[i] > gh[g]) {
          g = i;
        }
        if (bh[i] > bh[b]) {
          b = i;
        }
      }
      dstPixels[index] = rt[r] / rh[r] | 0;
      dstPixels[index + 1] = gt[g] / gh[g] | 0;
      dstPixels[index + 2] = bt[b] / bh[b] | 0;
      dstPixels[index + 3] = srcPixels[index + 3];
      index += 4;
    }
  }
  return dstImageData;
}

export function OpacityFilter(srcImageData, opacity) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  for (let i = 0; i < srcLength; i += 4) {
    dstPixels[i] = srcPixels[i];
    dstPixels[i + 1] = srcPixels[i + 1];
    dstPixels[i + 2] = srcPixels[i + 2];
    dstPixels[i + 3] = opacity;
  }
  return dstImageData;
}

/**
 * @param levels 2 <= n <= 255
 */
export function Posterize(srcImageData, levels) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  levels = levels < 2 ? 2 : levels > 255 ? 255 : levels;
  const levelMap = [];
  const levelsMinus1 = levels - 1;
  let j = 0;
  let k = 0;
  let i;
  for (i = 0; i < levels; i += 1) {
    levelMap[i] = (255 * i) / levelsMinus1;
  }

  helper.mapRGB(srcPixels, dstPixels, () => {
    const ret = levelMap[j];
    k += levels;
    if (k > 255) {
      k -= 255;
      j += 1;
    }
    return ret;
  });
  return dstImageData;
}

/**
 * @param scale 0.0 <= n <= 5.0
 */
export function Rescale(srcImageData, scale) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  helper.mapRGB(srcPixels, dstPixels, (value) => {
    value *= scale;
    return (value > 255) ? 255 : value + 0.5 | 0;
  });
  return dstImageData;
}

/**
 * Nearest neighbor
 */
export function ResizeNearestNeighbor(srcImageData, width, height) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(width, height);
  const dstPixels = dstImageData.data;
  const xFactor = srcWidth / width;
  const yFactor = srcHeight / height;
  let dstIndex = 0;
  let srcIndex;
  let x;
  let y;
  let offset;
  for (y = 0; y < height; y += 1) {
    offset = ((y * yFactor) | 0) * srcWidth;
    for (x = 0; x < width; x += 1) {
      srcIndex = (offset + x * xFactor) << 2;
      helper.copyPixel(dstPixels, srcPixels, srcIndex, dstIndex);
      dstIndex += 4;
    }
  }
  return dstImageData;
}

/**
 * Bilinear
 */
export function Resize(srcImageData, width, height) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(width, height);
  const dstPixels = dstImageData.data;
  const xFactor = srcWidth / width;
  const yFactor = srcHeight / height;
  let dstIndex = 0;
  let x;
  let y;
  for (y = 0; y < height; y += 1) {
    for (x = 0; x < width; x += 1) {
      helper.copyBilinear(srcPixels, x * xFactor, y * yFactor,
        srcWidth, srcHeight, dstPixels, dstIndex, 0);
      dstIndex += 4;
    }
  }
  return dstImageData;
}

/**
 * faster resizing using the builtin context.scale()
 * the resizing algorithm may be different between browsers
 * this might not work if the image is transparent.
 * to fix that we probably need two contexts
 */
export function ResizeBuiltin(srcImageData, width, height) {
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const canvas = helper.getSampleCanvas();
  const context = helper.getSampleContext();
  canvas.width = Math.max(srcWidth, width);
  canvas.height = Math.max(srcHeight, height);
  context.save();
  context.putImageData(srcImageData, 0, 0);
  context.scale(width / srcWidth, height / srcHeight);
  context.drawImage(canvas, 0, 0);
  const dstImageData = context.getImageData(0, 0, width, height);
  context.restore();
  canvas.width = 0;
  canvas.height = 0;
  return dstImageData;
}

export function Sepia(srcImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const srcLength = srcPixels.length;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  let r;
  let g;
  let b;
  let i;
  for (i = 0; i < srcLength; i += 4) {
    r = srcPixels[i];
    g = srcPixels[i + 1];
    b = srcPixels[i + 2];
    const rv = r * 0.393 + g * 0.769 + b * 0.189;
    const gv = r * 0.349 + g * 0.686 + b * 0.168;
    const bv = r * 0.272 + g * 0.534 + b * 0.131;
    dstPixels[i] = rv > 255 ? 255 : rv < 0 ? 0 : rv + 0.5 | 0;
    dstPixels[i + 1] = gv > 255 ? 255 : gv < 0 ? 0 : gv + 0.5 | 0;
    dstPixels[i + 2] = bv > 255 ? 255 : bv < 0 ? 0 : bv + 0.5 | 0;
    dstPixels[i + 3] = srcPixels[i + 3];
  }
  return dstImageData;
}

/**
 * @param factor 1 <= n
 */
export function Sharpen(srcImageData, factor) {
  // Convolution formula from VIGRA
  return ConvolutionFilter(srcImageData, 3, 3, [
    -factor / 16, -factor / 8, -factor / 16,
    -factor / 8, factor * 0.75 + 1, -factor / 8,
    -factor / 16, -factor / 8, -factor / 16,
  ]);
}

export function Solarize(srcImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  helper.mapRGB(srcPixels, dstPixels,
    (value) => (value > 127 ? (value - 127.5) * 2 : (127.5 - value) * 2));
  return dstImageData;
}

export function Transpose(srcImageData) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcHeight, srcWidth);
  const dstPixels = dstImageData.data;
  let srcIndex;
  let dstIndex;
  let y;
  let x;
  for (y = 0; y < srcHeight; y += 1) {
    for (x = 0; x < srcWidth; x += 1) {
      srcIndex = (y * srcWidth + x) << 2;
      dstIndex = (x * srcHeight + y) << 2;
      helper.copyPixel(dstPixels, srcPixels, srcIndex, dstIndex);
    }
  }
  return dstImageData;
}

/**
 * @param centerX 0.0 <= n <= 1.0
 * @param centerY 0.0 <= n <= 1.0
 * @param radius
 * @param angle(degree)
 * @param smooth
 */
export function Twril(srcImageData, centerX, centerY, radius, angle, edge, smooth) {
  const srcPixels = srcImageData.data;
  const srcWidth = srcImageData.width;
  const srcHeight = srcImageData.height;
  const dstImageData = helper.createImageData(srcWidth, srcHeight);
  const dstPixels = dstImageData.data;
  // convert position to px
  centerX = srcWidth * centerX;
  centerY = srcHeight * centerY;
  // degree to radian
  angle *= (Math.PI / 180);
  const radius2 = radius * radius;
  let dstIndex = 0;
  let x;
  let y;
  let dx;
  let dy;
  let distance;
  let a;
  let tx;
  let ty;
  let srcIndex;
  for (y = 0; y < srcHeight; y += 1) {
    for (x = 0; x < srcWidth; x += 1) {
      dx = x - centerX;
      dy = y - centerY;
      distance = dx * dx + dy * dy;
      if (distance > radius2) {
        // out of the effected area. just copy the pixel
        helper.copyPixel(dstPixels, srcPixels, dstIndex, dstIndex);
      } else {
        // main formula
        distance = Math.sqrt(distance);
        a = Math.atan2(dy, dx) + (angle * (radius - distance)) / radius;
        tx = centerX + distance * Math.cos(a);
        ty = centerY + distance * Math.sin(a);
        // copy target pixel
        if (smooth) {
          // bilinear
          helper.copyBilinear(srcPixels, tx, ty, srcWidth, srcHeight, dstPixels, dstIndex, edge);
        } else {
          // nearest neighbor
          // round tx, ty
          // TODO edge actions!!
          srcIndex = ((ty + 0.5 | 0) * srcWidth + (tx + 0.5 | 0)) << 2;
          helper.copyPixel(dstPixels, srcPixels, srcIndex, dstIndex);
        }
      }
      dstIndex += 4;
    }
  }
  return dstImageData;
}

export class Rippler {
  constructor(source, strength, scale) {
    // eslint-disable-next-line no-console
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
