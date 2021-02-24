<template>
  <div class="home">
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

export default {
  data() {
    return {
      visible: false,
      isJoin: false,
      form: {
        serial: '',
        name: '',
      },
    };
  },
  methods: {
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
.box {
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding-top: 300px;
  padding-left: -30px;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, .12), 0 0 12px rgba(0, 0, 0, .04);
    &:hover {
      box-shadow: none;
    }
  }
}
</style>
