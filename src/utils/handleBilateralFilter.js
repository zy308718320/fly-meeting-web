import * as cv from 'opencv.js-webassembly';

export default async (src, width, height, quality) => {
  if (cv.calledRun) {
    // ImageData对象转Mat对象
    const mat = cv.matFromArray(height, width, cv.CV_8UC4, src);
    // 4通道mat对象转3通道mat（bilateralFilter仅支持1或者3通道，ImageData是4通道）
    cv.cvtColor(mat, mat, cv.COLOR_RGBA2RGB, 0);
    const temp = new cv.Mat(height, width, cv.CV_8UC3);
    await cv.bilateralFilter(mat, temp, quality, 75, 75, cv.BORDER_DEFAULT);
    cv.cvtColor(temp, temp, cv.COLOR_RGB2RGBA);
    // temp.data是数据引用，直接return会报错，构造新的Uint8ClampedArray数据
    const dst = Uint8ClampedArray.from(temp.data);
    // GC
    mat.delete();
    temp.delete();
    return dst;
  }
  return src;
};
