<template>
  <div class="meeting">
    <user-video
      :width="windowWidth"
      :height="windowHeight"
      :video-setting="setting.video"
      :is-compared="true"
      :is-webgl="true"
    />
    <setting class="meeting-setting" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import userVideo from '@/components/userVideo.vue';
import setting from '@/components/setting.vue';

export default {
  components: {
    userVideo,
    setting,
  },
  computed: {
    ...mapState([
      'windowWidth',
      'windowHeight',
      'setting',
    ]),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
    },
  },
};
</script>

<style lang="less" scoped>
.meeting {
  position: relative;
  width: 100%;
  height: 100vh;
  &-setting{
    position: absolute;
    bottom: 50px;
    right: 50px;
  }
}
</style>
