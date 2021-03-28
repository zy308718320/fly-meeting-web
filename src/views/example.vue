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
      :is-compared="isCompared"
      :video-setting="setting.video"
    />
    <canvas
      ref="canvas"
      @mousemove="canvasHover"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import { spawn, Thread, Worker } from 'threads';
import * as types from '@/store/mutation-types';
import userVideo from '@/components/userVideo.vue';

export default {
  components: {
    userVideo,
  },
  data() {
    return {
      handleRippler: null,
      canvas: null,
      mouseX: null,
      mouseY: null,
      videoWidth: 640,
      videoHeight: 480,
      isCompared: true,
    };
  },
  computed: {
    ...mapState([
      'setting',
    ]),
  },
  mounted() {
    this.init();
  },
  async beforeUnmount() {
    await Thread.terminate(this.handleRippler);
  },
  methods: {
    ...mapMutations({
      setSetting: types.SET_SETTINGS,
    }),
    async init() {
      this.run();
      this.setSetting({
        ...this.setting,
        video: {
          ...this.setting.video,
          beautify: 1,
        },
      });
      this.handleRippler = await spawn(new Worker('@/workers/handleRippler'));
    },
    run() {
      const {
        logo, canvas,
      } = this.$refs;
      const ctx = canvas.getContext('2d');
      const draw = async () => {
        if (this.handleRippler) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = await this.handleRippler(this.mouseX, this.mouseY, 8, 1, {
            source: imageData,
            strength: 60,
            scale: 8,
          });
          if (result) {
            ctx.putImageData(result, 0, 0);
          }
        }
        requestAnimationFrame(draw);
      };
      logo.onload = async () => {
        canvas.width = logo.width;
        canvas.height = logo.height;
        ctx.drawImage(logo, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(draw);
        if (!this.canvas) {
          this.canvas = canvas;
        }
      };
      // const displayMediaOptions = {
      //   video: {
      //     cursor: 'always',
      //   }, // 视频信息的设置
      //   audio: false, // 是否包含音频信息
      //   logicalSurface: false, // 设置是否包含所选屏幕外区域的一些信息
      // };
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
