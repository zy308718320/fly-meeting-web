<template>
  <div class="home">
    <canvas
      ref="canvas"
      class="canvas"
      :style="`width: ${canvasWidth}px; height: ${canvasHeight}px;
       transform: translate3d(${canvasLeft}px, ${canvasTop}px, 0)`"
      @mousemove="canvasHover"
    />
    <div class="box">
      <div
        class="box-btn"
        @click="createMeeting"
      >
        创建会议
      </div>
      <div
        class="box-btn"
        @click="joinMeeting"
      >
        加入会议
      </div>
    </div>
    <el-dialog
      v-model="visible"
      :title="isJoin ? '加入会议' : '创建会议'"
      width="30%"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
      >
        <el-form-item
          v-if="isJoin"
          label="会议号"
        >
          <el-input v-model="form.serial" />
        </el-form-item>
        <el-form-item label="您的名称">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="onConfirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { spawn, Thread, Worker } from 'threads';
import { outside } from '@/utils/adaptive';
import helper from '@/utils/helper';
import bgImg from '@/assets/images/bg.jpg';

export default {
  data() {
    return {
      isSet: false,
      canvas: null,
      worker: null,
      mouseX: 0,
      mouseY: 0,
      imgWidth: 0,
      imgHeight: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      canvasTop: 0,
      canvasLeft: 0,
      visible: false,
      isJoin: false,
      form: {
        serial: '',
        name: '',
      },
    };
  },
  computed: {
    ...mapState([
      'windowWidth',
      'windowHeight',
    ]),
  },
  watch: {
    windowWidth() {
      this.isSet = false;
      this.resize();
    },
    windowHeight() {
      this.isSet = false;
      this.resize();
    },
  },
  async mounted() {
    this.worker = await spawn(new Worker('@/workers/'));
    this.play();
  },
  async beforeUnmount() {
    await Thread.terminate(this.worker);
  },
  methods: {
    play() {
      const { canvas } = this.$refs;
      const ctx = canvas.getContext('2d');
      const bg = new Image();
      bg.src = bgImg;
      bg.onload = () => {
        const shadowCanvas = helper.getSampleCanvas();
        const shadowCtx = helper.getSampleContext();
        this.imgWidth = bg.width;
        this.imgHeight = bg.height;
        this.resize();
        let imageData;
        const draw = async () => {
          if (!this.isSet) {
            const {
              imgWidth, imgHeight,
            } = this;
            shadowCanvas.width = imgWidth;
            shadowCanvas.height = imgHeight;
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            shadowCtx.drawImage(bg, 0, 0, imgWidth, imgHeight);
            ctx.drawImage(bg, 0, 0, imgWidth, imgHeight);
            imageData = shadowCtx.getImageData(0, 0, imgWidth, imgHeight);
            this.isSet = true;
          }
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
    },
    resize() {
      const {
        windowWidth, windowHeight, imgWidth, imgHeight,
      } = this;
      const dest = outside(windowWidth, windowHeight, imgWidth, imgHeight);
      this.canvasWidth = dest.width;
      this.canvasHeight = dest.height;
      this.canvasTop = dest.top;
      this.canvasLeft = dest.left;
    },
    async canvasHover(e) {
      if (this.canvas) {
        const {
          windowWidth, windowHeight, imgWidth, imgHeight,
        } = this;
        const widthRatio = imgWidth / windowWidth;
        const heightRatio = imgHeight / windowHeight;
        this.mouseX = e.pageX * widthRatio - this.canvas.offsetLeft;
        this.mouseY = e.pageY * heightRatio - this.canvas.offsetTop;
      }
    },
    createMeeting() {
      this.isJoin = false;
      this.clearForm();
      this.visible = true;
    },
    joinMeeting() {
      this.isJoin = true;
      this.clearForm();
      this.visible = true;
    },
    clearForm() {
      this.form = {
        serial: '',
        name: '',
      };
    },
    onConfirm() {
      this.$router.replace('meeting');
    },
  },
};
</script>

<style lang="less">
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.canvas {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
}
.box {
  position: relative;
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding-top: 300px;
  padding-left: -30px;
  z-index: 1;
  &-btn {
    cursor: pointer;
    flex: 1;
    height: 180px;
    line-height: 180px;
    text-align: center;
    margin-left: 30px;
    color: #333;
    font-size: 18px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, .12);
    &:hover {
      box-shadow: none;
    }
  }
}
</style>
