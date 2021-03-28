<template>
  <div class="setting">
    <el-button
      type="info"
      icon="el-icon-setting"
      class="setting-btn"
      circle
      @click="handleSetting"
    />
    <el-drawer
      v-model="drawer"
      title="设置"
      :with-header="true"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="70px"
        class="setting-form"
      >
        <el-form-item label="美颜级别">
          <el-slider
            v-model="form.beautify"
            :min="0"
            :max="10"
          />
        </el-form-item>
        <el-form-item label="背景遮罩">
          <el-select
            v-model="form.mask"
            placeholder="无"
          >
            <el-option
              v-for="item in maskOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="画面镜像">
          <el-switch
            v-model="form.isMirror"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit"
          >
            保存
          </el-button>
          <el-button @click="handleCancel">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import * as types from '@/store/mutation-types';
import maskFilterDefault from '@/configs/maskFilterDefault';

export default {
  name: 'Setting',
  data() {
    return {
      drawer: false,
      form: {},
      maskOptions: [],
    };
  },
  computed: {
    ...mapState([
      'setting',
    ]),
  },
  mounted() {
    this.initMaskOptions();
    this.initSetting();
  },
  methods: {
    ...mapMutations({
      setSetting: types.SET_SETTINGS,
    }),
    initSetting() {
      const { video } = this.setting;
      let mask = '';
      if (video.mask) {
        mask = video.filterType;
      }
      this.form = {
        ...video,
        mask,
      };
    },
    initMaskOptions() {
      this.maskOptions = Object.keys(maskFilterDefault).map((item) => (
        {
          value: item,
          label: item,
        }
      ));
      this.maskOptions.unshift(
        {
          value: '',
          label: '无',
        },
      );
    },
    handleSetting() {
      this.drawer = true;
    },
    handleSubmit() {
      this.drawer = false;
      const { form } = this;
      let mask = null;
      if (form.mask) {
        mask = {
          filterType: form.mask,
          filterParam: maskFilterDefault[form.mask],
        };
      }
      this.setSetting({
        ...this.setting,
        video: {
          ...form,
          mask,
        },
      });
    },
    handleCancel() {
      this.drawer = false;
      this.initSetting();
    },
  },
};
</script>

<style lang="less" scoped>
.setting {
  &-btn {
    padding: 0;
    width: 50px;
    height: 50px;
    font-size: 32px;
  }
  &-form {
    width: 90%;
    margin: 0 auto;
  }
}
</style>
