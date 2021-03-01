<template>
  <div class="home">
    <canvas
      ref="canvas"
      class="canvas"
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
import { spawn, Thread, Worker } from 'threads';
import bgImg from '@/assets/images/bg.jpg';

export default {
  data() {
    return {
      canvas: null,
      worker: null,
      mouseX: null,
      mouseY: null,
      visible: false,
      isJoin: false,
      form: {
        serial: '',
        name: '',
      },
    };
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
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
    },
    async canvasHover(e) {
      if (this.canvas) {
        this.mouseX = e.pageX - this.canvas.offsetLeft;
        this.mouseY = e.pageY - this.canvas.offsetTop;
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
}
.canvas {
  position: absolute;
  width: 100%;
  height: 100%;
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
