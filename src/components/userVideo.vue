<template>
  <div>
    <video
      ref="video"
      class="hide"
    />
    <canvas
      ref="videoCanvas"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { spawn, Thread, Worker } from 'threads';
import helper from '@/utils/helper';

export default {
  name: 'Video',
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
        video: true,
        audio: false,
      }),
    },
  },
  data() {
    return {
      worker: null,
    };
  },
  mounted() {
    this.init();
  },
  async beforeUnmount() {
    await Thread.terminate(this.worker);
  },
  methods: {
    init() {
      const { video } = this.$refs;
      video.width = this.videoWidth;
      video.height = this.videoHeight;
      this.play();
    },
    async play() {
      const {
        video, videoCanvas,
      } = this.$refs;
      const { getUserMedia } = navigator.mediaDevices;
      video.srcObject = await getUserMedia(this.userMediaOptions);
      video.play();
      let isSet = false;
      const ctx = videoCanvas.getContext('2d');
      const shadowCanvas = helper.getSampleCanvas();
      const shadowCtx = helper.getSampleContext();
      const worker = await spawn(new Worker('@/workers/'));
      this.worker = worker;
      const draw = async () => {
        if (!isSet && video.videoWidth > 0) {
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          videoCanvas.width = video.videoWidth;
          videoCanvas.height = video.videoHeight;
          shadowCanvas.width = videoCanvas.width;
          shadowCanvas.height = videoCanvas.height;
          isSet = true;
        }
        if (this.filterType) {
          shadowCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
          const videoData = shadowCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height);
          const segmentation = await worker.handleBodyPix(videoData);
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
  },
};
</script>
