<template>
  <div
    class="user-video-box"
    :style="`width: ${windowWidth}px; height: ${windowHeight}px;`"
  >
    <user-video
      :width="windowWidth"
      :height="windowHeight"
      :filter-type="filterType"
      :filter-param="filterParam"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import maskFilterDefault from '@/configs/maskFilterDefault';
import userVideo from '@/components/userVideo.vue';

export default {
  name: 'UserVideoBox',
  components: {
    userVideo,
  },
  data() {
    return {
      filterType: 'Edge',
      filterParam: [],
    };
  },
  computed: {
    ...mapState([
      'windowWidth',
      'windowHeight',
    ]),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.filterParam = maskFilterDefault[this.filterType];
    },
  },
};
</script>

<style lang="less" scoped>
  .user-video-box {
    position: relative;
  }
</style>
