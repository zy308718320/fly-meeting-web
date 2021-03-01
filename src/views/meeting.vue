<template>
  <div class="meeting">
    <user-video
      :width="videoWidth"
      :height="videoHeight"
      :filter-type="filterType"
      :filter-param="filterParam"
    />
  </div>
</template>

<script>
import maskFilterDefault from '@/config/maskFilterDefault';
import userVideo from '@/components/userVideo.vue';

export default {
  components: {
    userVideo,
  },
  data() {
    return {
      videoWidth: 640,
      videoHeight: 480,
      filterType: 'Edge',
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
    },
  },
};
</script>

<style lang="less" scoped>
.meeting {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
