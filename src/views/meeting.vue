<template>
  <div class="meeting">
    <user-video-box />
  </div>
</template>

<script>
import userVideoBox from '@/components/userVideoBox.vue';

export default {
  components: {
    userVideoBox,
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
