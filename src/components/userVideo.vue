<template>
  <div
    class="video-wrap mirror"
    :style="`width: ${width}px; height: ${height}px;`"
  >
    <video
      ref="video"
      :width="videoWidth"
      :height="videoHeight"
      class="hide"
    />
    <canvas
      ref="videoCanvas"
      :width="videoWidth"
      :height="videoHeight"
      :style="`transform: translate3d(${videoLeft}px, ${videoTop}px, 0)`"
    />
  </div>
</template>

<script>
import { spawn, Thread, Worker } from 'threads';
import helper from '@/utils/helper';
import { inside } from '@/utils/adaptive';
import { loadConfigs, segmentConfigs } from '@/configs/bodyPixDefault';

export default {
  name: 'UserVideo',
  props: {
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    filterType: {
      type: String,
      default: '',
    },
    filterParam: {
      type: Array,
      default: () => [],
    },
    userMediaOptions: {
      type: Object,
      default: () => ({
        video: { facingMode: 'user' },
        audio: false,
      }),
    },
  },
  data() {
    return {
      isSet: false,
      worker: null,
      srcVideoWidth: 0,
      srcVideoHeight: 0,
      videoWidth: 0,
      videoHeight: 0,
      videoLeft: 0,
      videoTop: 0,
    };
  },
  watch: {
    width() {
      this.isSet = false;
      this.resize();
    },
    height() {
      this.isSet = false;
      this.resize();
    },
  },
  mounted() {
    this.init();
  },
  async beforeUnmount() {
    await Thread.terminate(this.worker);
  },
  methods: {
    init() {
      this.play();
    },
    async play() {
      const {
        video, videoCanvas,
      } = this.$refs;
      const { getUserMedia } = navigator.mediaDevices;
      video.srcObject = await getUserMedia(this.userMediaOptions);
      video.play();
      const ctx = videoCanvas.getContext('2d');
      const shadowCanvas = helper.getSampleCanvas();
      const shadowCtx = helper.getSampleContext();
      const worker = await spawn(new Worker('@/workers/'));
      this.worker = worker;
      this.srcVideoWidth = video.videoWidth;
      this.srcVideoHeight = video.videoHeight;
      this.resize();
      const draw = async () => {
        if (!this.isSet && video.videoWidth > 0) {
          shadowCanvas.width = videoCanvas.width;
          shadowCanvas.height = videoCanvas.height;
          this.isSet = true;
        }
        if (this.filterType) {
          shadowCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
          const videoData = shadowCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height);
          const segmentation = await worker.handleBodyPix(
            videoData,
            loadConfigs,
            segmentConfigs,
          );
          const result = await worker.handleFilter(this.filterType,
            [videoData, ...this.filterParam, segmentation.data]);
          ctx.putImageData(result, 0, 0);
        } else {
          ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
        }
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
    },
    resize() {
      const {
        width,
        height,
        srcVideoWidth,
        srcVideoHeight,
      } = this;
      const dest = inside(width, height, srcVideoWidth, srcVideoHeight);
      this.videoWidth = dest.width;
      this.videoHeight = dest.height;
      this.videoTop = dest.top;
      this.videoLeft = dest.left;
    },
  },
};
</script>

<style lang="less" scoped>
.video-wrap {
  position: relative;
  overflow: hidden;
  background: #000;
}
.mirror {
  transform: rotate3d(0, 1, 0, 180deg);
}
</style>
