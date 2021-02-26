<template>
  <div class="meeting">
    <canvas
      ref="video"
      class="video"
    />
  </div>
</template>

<script>
import { spawn, Worker } from 'threads';

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
      const worker = await spawn(new Worker('@/workers/'));
      const draw = async () => {
        if (!isSet && videoEl.videoWidth > 0) {
          videoEl.width = videoEl.videoWidth;
          videoEl.height = videoEl.videoHeight;
          video.width = videoEl.videoWidth;
          video.height = videoEl.videoHeight;
          isSet = true;
        }
        ctx.drawImage(videoEl, 0, 0, video.width, video.height);
        const videoData = ctx.getImageData(0, 0, video.width, video.height);
        const segmentation = await worker.handleBodyPix(videoData);
        const filtered = await worker.handleFilter('Binarize', [videoData, 0.5, segmentation.data]);
        ctx.putImageData(filtered, 0, 0);
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    },
  },
};
</script>

<style lang="less" scoped>
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
