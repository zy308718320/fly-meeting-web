<template>
  <div class="home">
    <img ref="logo" class="hide" alt="Vue logo" src="../assets/test.png">
    <video ref="video" class="hide" src=""></video>
    <canvas ref="canvas"></canvas>
    <canvas ref="canvas2" @mousemove="canvasHover"></canvas>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import adapter from 'webrtc-adapter';
import {
  Rippler,
  // Binarize,
  // BoxBlur,
  // GaussianBlur,
  // StackBlur,
  // BrightnessContrastGimp,
  // BrightnessContrastPhotoshop,
  // Channels,
  // ColorTransformFilter,
  // Desaturate,
  // Dither,
  // Edge,
  // Emboss,
  // Enrich,
  // Flip,
  // Gamma,
  // GrayScale,
  // HSLAdjustment,
  // Invert,
  // Mosaic,
  // Oil,
  // Posterize,
  // Rescale,
  // ResizeNearestNeighbor,
  // Resize,
  // ResizeBuiltin,
  Sepia,
  // Sharpen,
  // Solarize,
  // Transpose,
  // Twril,
} from '@/utils/effect';
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      canvas: null,
      rippler: null,
    };
  },
  mounted() {
    this.play();
  },
  methods: {
    async play() {
      // const displayMediaOptions = {
      //   video: {
      //     cursor: 'always',
      //   }, // 视频信息的设置
      //   audio: false, // 是否包含音频信息
      //   logicalSurface: false, // 设置是否包含所选屏幕外区域的一些信息
      // };
      const userMediaOptions = {
        video: true,
        audio: true,
      };
      let isSet = false;
      const {
        logo, video, canvas, canvas2,
      } = this.$refs;
      const ctx = canvas.getContext('2d');
      const ctx2 = canvas2.getContext('2d');
      logo.onload = () => {
        canvas2.width = logo.width;
        canvas2.height = logo.height;
        ctx2.drawImage(logo, 0, 0, canvas2.width, canvas2.height);
        const logoData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
        const rippler = new Rippler(logoData, 60, 8);
        rippler.onUpdate = (target) => {
          ctx2.putImageData(target, 0, 0);
        };
        if (!this.canvas) {
          this.canvas = canvas2;
        }
        if (!this.rippler) {
          this.rippler = rippler;
        }
      };
      const {
        getUserMedia,
        // getDisplayMedia,
      } = navigator.mediaDevices;
      video.srcObject = await getUserMedia(userMediaOptions);
      // video.srcObject = await getDisplayMedia(displayMediaOptions);
      video.play();
      const draw = () => {
        if (!isSet && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          isSet = true;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const filtered = Sepia(imageData);
        ctx.putImageData(filtered, 0, 0);
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
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

<style lang="less">
.hide {
  display: none;
}
</style>
