<template>
  <div class="home">
    <img
      ref="logo"
      class="hide"
      alt="Vue logo"
      src="../assets/images/test.png"
    >
    <video
      ref="video"
      class="hide"
      src=""
    />
    <canvas ref="canvas" />
    <canvas
      ref="canvas2"
      @mousemove="canvasHover"
    />
  </div>
</template>

<script>
/* eslint-disable no-console, no-unused-vars */
import adapter from 'webrtc-adapter';
import Rippler from '@/utils/rippler';
import { spawn, Thread, Worker } from 'threads';
import handleBodyPix from '@/utils/handleBodyPix';

export default {
  name: 'Home',
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
        audio: false,
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
      // const backgroundBlurAmount = 18;
      // const edgeBlurAmount = 8;
      // const flipHorizontal = false;
      const worker = await spawn(new Worker('@/workers/'));
      const draw = async () => {
        if (!isSet && video.videoWidth > 0) {
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          isSet = true;
        }
        const segmentation = await handleBodyPix(video);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const videoData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = await worker.handleFilter('Binarize', [videoData, 0.5, segmentation.data]);
        ctx.putImageData(result, 0, 0);
        // bodyPix.drawBokehEffect(
        //   video, videoEl, segmentation, backgroundBlurAmount, edgeBlurAmount, flipHorizontal,
        // );
        requestAnimationFrame(draw);
      };
      requestAnimationFrame(draw);
      // const draw = () => {
      //   if (!isSet && video.videoWidth > 0) {
      //     canvas.width = video.videoWidth;
      //     canvas.height = video.videoHeight;
      //     isSet = true;
      //   }
      //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      //   const filtered = Sepia(imageData);
      //   ctx.putImageData(filtered, 0, 0);
      //   requestAnimationFrame(draw);
      // };
      // requestAnimationFrame(draw);
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
