export const loadConfigs = {
  architecture: 'MobileNetV1',
  multiplier: 0.75,
  stride: 16,
  quantBytes: 2,
};

export const segmentConfigs = {
  flipHorizontal: true,
  maxDetections: 1,
  scoreThreshold: 0.5,
  segmentationThreshold: 0.6,
};
