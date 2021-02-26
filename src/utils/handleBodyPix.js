import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';

let net = null;

export default async function (videoData) {
  if (!net) {
    tf.getBackend();
    net = await bodyPix.load();
  }
  return net.segmentPerson(videoData);
}
