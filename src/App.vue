<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style lang="scss">
@import '~@/theme/reset.scss';
@import '~@/theme/index.scss';

#app {
  font-size: 12px;
  color: #606266;

  .van-button--primary {
    border-color: $--color-primary;
    background-color: $--color-primary;
  }
  .van-button--disabled {
    opacity: 0.7;
  }
}
</style>
