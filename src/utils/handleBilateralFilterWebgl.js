import glUtil from '../libs/bilateralFilterWebgl';
import helper from './helper';

export default async (src, width, height, level) => {
  const context = helper.getSampleContext('webgl');
  const dest = await glUtil.renderWithWebGL(context, width, height, src, true, level);
  return dest;
};
