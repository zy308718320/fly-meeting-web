import * as effect from '@/utils/effect';

/**
 * @param {number} type
  Binarize,
  BoxBlur,
  GaussianBlur,
  StackBlur,
  BrightnessContrastGimp,
  BrightnessContrastPhotoshop,
  Channels,
  ColorTransformFilter,
  Desaturate,
  Dither,
  Edge,
  Emboss,
  Enrich,
  Flip,
  Gamma,
  GrayScale,
  HSLAdjustment,
  Invert,
  Mosaic,
  Oil,
  Posterize,
  Rescale,
  ResizeNearestNeighbor,
  Resize,
  ResizeBuiltin,
  Sepia,
  Sharpen,
  Solarize,
  Transpose,
  Twril,
 * @param {*[]} arg
 */
export default (type, arg) => effect[type](...arg);
