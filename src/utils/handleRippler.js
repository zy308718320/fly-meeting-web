import Rippler from '@/utils/rippler';

let rippler = null;

export default function (x, y, size, alpha, opt) {
  if (!rippler) {
    rippler = new Rippler(opt.source, opt.strength, opt.scale);
  }
  let result = null;
  if (x || y) {
    result = rippler.drawRipple(x, y, size, alpha);
  }
  return result;
}
