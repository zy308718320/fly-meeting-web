import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

let net = null;

export default async function (videoData, loadConfigs, segmentConfigs) {
  if (!net) {
    await tf.setBackend('webgl');
    net = await bodyPix.load(loadConfigs);
  }
  return net.segmentPerson(videoData, segmentConfigs);
}
