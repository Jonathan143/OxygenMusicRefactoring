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
@import './theme/index.scss';

#app {
  font-size: 12px;
  color: $--color-text-regular;
}
</style>
