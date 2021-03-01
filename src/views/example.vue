<template>
  <div class="home">
    <img
      ref="logo"
      class="hide"
      alt="Vue logo"
      src="../assets/images/test.png"
    >
    <user-video
      :width="videoWidth"
      :height="videoHeight"
      :filter-type="filterType"
      :filter-param="filterParam"
    />
    <canvas
      ref="canvas"
      @mousemove="canvasHover"
    />
  </div>
</template>

<script>
import maskFilterDefault from '@/config/maskFilterDefault';
import userVideo from '@/components/userVideo.vue';
import { spawn, Thread, Worker } from 'threads';

export default {
  components: {
    userVideo,
  },
  data() {
    return {
      worker: null,
      canvas: null,
      mouseX: null,
      mouseY: null,
      videoWidth: 640,
      videoHeight: 480,
      filterType: 'BrightnessContrastPhotoshop',
      filterParam: [],
    };
  },
  mounted() {
    this.init();
  },
  async beforeUnmount() {
    await Thread.terminate(this.worker);
  },
  methods: {
    async init() {
      this.filterParam = maskFilterDefault[this.filterType];
      this.run();
    },
    run() {
      // const displayMediaOptions = {
      //   video: {
      //     cursor: 'always',
      //   }, // 视频信息的设置
      //   audio: false, // 是否包含音频信息
      //   logicalSurface: false, // 设置是否包含所选屏幕外区域的一些信息
      // };
      const {
        logo, canvas,
      } = this.$refs;
      const ctx = canvas.getContext('2d');
      logo.onload = async () => {
        this.worker = await spawn(new Worker('@/workers/'));
        canvas.width = logo.width;
        canvas.height = logo.height;
        ctx.drawImage(logo, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const draw = async () => {
          const result = await this.worker.handleRippler(this.mouseX, this.mouseY, 8, 1, {
            source: imageData,
            strength: 60,
            scale: 8,
          });
          if (result) {
            ctx.putImageData(result, 0, 0);
          }
          requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
        if (!this.canvas) {
          this.canvas = canvas;
        }
      };
      // const { getDisplayMedia } = navigator.mediaDevices;
      // video.srcObject = await getDisplayMedia(displayMediaOptions);
    },
    canvasHover(e) {
      if (this.canvas) {
        this.mouseX = e.pageX - this.canvas.offsetLeft;
        this.mouseY = e.pageY - this.canvas.offsetTop;
      }
    },
  },
};
</script>
