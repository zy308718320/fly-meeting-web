<template>
  <div class="meeting">
    <canvas
      ref="video"
      class="video"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter';
// import webwork from '@kolodny/webwork';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { StackBlur } from '@/utils/effect';

export default {
  mounted() {
    this.play();
  },
  methods: {
    async play() {
      const userMediaOptions = {
        video: true,
        audio: false,
      };
      const { video } = this.$refs;
      const ctx = video.getContext('2d');
      const videoEl = document.createElement('video');
      const { getUserMedia } = navigator.mediaDevices;
      let isSet = false;
      videoEl.srcObject = await getUserMedia(userMediaOptions);
      videoEl.play();
      tf.getBackend();
      const net = await bodyPix.load();
      const draw = async () => {
        if (!isSet && videoEl.videoWidth > 0) {
          videoEl.width = videoEl.videoWidth;
          videoEl.height = videoEl.videoHeight;
          video.width = videoEl.videoWidth;
          video.height = videoEl.videoHeight;
          isSet = true;
        }
        const segmentation = await net.segmentPerson(videoEl);
        ctx.drawImage(videoEl, 0, 0, video.width, video.height);
        const videoData = ctx.getImageData(0, 0, video.width, video.height);
        const filtered = StackBlur(videoData, 40, segmentation.data);
        ctx.putImageData(filtered, 0, 0);
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    },
  },
};
</script>

<style lang="less">
.meeting {
  position: relative;
  width: 100%;
  height: 100vh;
}
.video {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}
</style>
