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
import Rippler from '@/utils/rippler';
import maskFilterDefault from '@/config/maskFilterDefault';
import userVideo from '@/components/userVideo.vue';

export default {
  components: {
    userVideo,
  },
  data() {
    return {
      canvas: null,
      rippler: null,
      videoWidth: 640,
      videoHeight: 480,
      filterType: 'BrightnessContrastPhotoshop',
      filterParam: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.filterParam = maskFilterDefault[this.filterType];
      this.videoWidth = window.innerWidth;
      this.videoHeight = window.innerHeight;
      this.run();
    },
    async run() {
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
      logo.onload = () => {
        canvas.width = logo.width;
        canvas.height = logo.height;
        ctx.drawImage(logo, 0, 0, canvas.width, canvas.height);
        const logoData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const rippler = new Rippler(logoData, 60, 8);
        rippler.onUpdate = (target) => {
          ctx.putImageData(target, 0, 0);
        };
        if (!this.canvas) {
          this.canvas = canvas;
        }
        if (!this.rippler) {
          this.rippler = rippler;
        }
      };
      // const { getDisplayMedia } = navigator.mediaDevices;
      // video.srcObject = await getDisplayMedia(displayMediaOptions);
    },
    canvasHover(e) {
      if (this.canvas && this.rippler) {
        const mouseX = e.pageX - this.canvas.offsetLeft;
        const mouseY = e.pageY - this.canvas.offsetTop;
        this.rippler.drawRipple(mouseX, mouseY, 8, 1);
      }
    },
  },
};
</script>
