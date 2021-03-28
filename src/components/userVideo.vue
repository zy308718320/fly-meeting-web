<template>
  <div
    class="video-wrap mirror"
    :class="isCompared ? 'compared' : ''"
    :style="`width: ${width}px; height: ${height}px;`"
  >
    <canvas
      ref="videoCanvas"
      :width="videoWidth"
      :height="videoHeight"
      :style="`transform: translate3d(${videoLeft}px, ${videoTop}px, 0)`"
    />
    <video
      ref="video"
      :width="videoWidth"
      :height="videoHeight"
      class="hide"
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
    isCompared: {
      type: Boolean,
      default: false,
    },
    isBeautify: {
      type: Boolean,
      default: false,
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
      handleBilateralFilter: null,
      handleBodyPix: null,
      handleFilter: null,
      srcVideoWidth: 0,
      srcVideoHeight: 0,
      videoWidth: 0,
      videoHeight: 0,
      videoLeft: 0,
      videoTop: 0,
      bilateralFilter: null,
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
  async mounted() {
    this.init();
  },
  async beforeUnmount() {
    await Thread.terminate(this.handleBilateralFilter);
    await Thread.terminate(this.handleBodyPix);
    await Thread.terminate(this.handleFilter);
  },
  methods: {
    async init() {
      this.handleBilateralFilter = await spawn(new Worker('@/workers/handleBilateralFilter'));
      this.handleBodyPix = await spawn(new Worker('@/workers/handleBodyPix'));
      this.handleFilter = await spawn(new Worker('@/workers/handleFilter'));
      this.play();
    },
    async play() {
      const { video, videoCanvas } = this.$refs;
      const { getUserMedia } = navigator.mediaDevices;
      const ctx = videoCanvas.getContext('2d');
      const shadowCanvas = helper.getSampleCanvas();
      const shadowCtx = helper.getSampleContext();
      video.srcObject = await getUserMedia(this.userMediaOptions);
      video.play();
      const draw = async () => {
        if (!this.isSet && video.videoWidth > 0) {
          shadowCanvas.width = videoCanvas.width;
          shadowCanvas.height = videoCanvas.height;
          this.isSet = true;
        }
        let resultVideo = video;
        shadowCtx.drawImage(
          resultVideo,
          0,
          0,
          videoCanvas.width,
          videoCanvas.height,
        );
        resultVideo = shadowCtx.getImageData(
          0,
          0,
          videoCanvas.width,
          videoCanvas.height,
        );
        if (this.isBeautify || this.filterType) {
          if (this.isBeautify) {
            // 美颜磨皮（双边滤波）
            const dstPixels = await this.handleBilateralFilter(
              resultVideo.data,
              resultVideo.width,
              resultVideo.height,
              7,
            );
            resultVideo = new ImageData(
              dstPixels,
              resultVideo.width,
              resultVideo.height,
            );
          }
          if (this.filterType) {
            const segmentation = await this.handleBodyPix(
              resultVideo,
              loadConfigs,
              segmentConfigs,
            );
            resultVideo = await this.handleFilter(this.filterType, [
              resultVideo,
              ...this.filterParam,
              segmentation.data,
            ]);
          }
          ctx.putImageData(resultVideo, 0, 0);
        } else {
          ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
        }
        requestAnimationFrame(draw);
      };
      video.onloadeddata = () => {
        this.srcVideoWidth = video.videoWidth;
        this.srcVideoHeight = video.videoHeight;
        this.resize();
        requestAnimationFrame(draw);
      };
    },
    resize() {
      const {
        width, height, srcVideoWidth, srcVideoHeight,
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

<style
  lang="less"
  scoped
>
.video-wrap {
  position: relative;
  overflow: hidden;
  background: #000;
}

.mirror {
  transform: rotate3d(0, 1, 0, 180deg);
}

.compared {
  display: flex;
  justify-content: center;
  width: auto !important;
  background: #fff;
  overflow: visible;

  .hide {
    display: block;
  }
}
</style>
