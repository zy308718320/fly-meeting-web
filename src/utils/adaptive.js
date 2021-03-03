export function inside(windowWidth, windowHeight, srcWidth, srcHeight) {
  const srcRatio = srcWidth / srcHeight;
  const dest = {};
  let multiple;
  if (windowWidth / windowHeight >= srcRatio) {
    multiple = windowHeight / srcHeight;
    dest.width = srcWidth * multiple;
    dest.height = windowHeight;
    dest.top = 0;
    dest.left = (windowWidth - dest.width) / 2;
  } else {
    multiple = windowWidth / srcWidth;
    dest.width = windowWidth;
    dest.height = srcHeight * multiple;
    dest.top = (windowHeight - dest.height) / 2;
    dest.left = 0;
  }
  return dest;
}

export function outside(windowWidth, windowHeight, srcWidth, srcHeight) {
  const srcRatio = srcWidth / srcHeight;
  const dest = {};
  let multiple;
  if (windowWidth / windowHeight >= srcRatio) {
    multiple = windowWidth / srcWidth;
    dest.width = windowWidth;
    dest.height = srcHeight * multiple;
    dest.top = (windowHeight - dest.height) / 2;
    dest.left = 0;
  } else {
    multiple = windowHeight / srcHeight;
    dest.width = srcWidth * multiple;
    dest.height = windowHeight;
    dest.top = 0;
    dest.left = (windowWidth - dest.width) / 2;
  }
  return dest;
}
