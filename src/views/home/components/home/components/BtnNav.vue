<template>
  <div class="btn-nav">
    <div v-for="(item, idx) in iconBtn"
      :key="idx"
      class="btn-nav__item">
      <div class="item__btn"
        @click="changeRouter(item.path)">
        <i class="iconfont"
          :class="item.icon"></i>
      </div>
      <p class="item__text">{{ item.text }}</p>
    </div>
  </div>
</template>

<script>
const iconBtn = [
  {
    icon: 'icon-playlist',
    text: '歌单',
    path: '/playlist'
  },
  {
    icon: 'icon-singer',
    text: '歌手',
    path: '/artist'
  },
  {
    icon: 'icon-toplist2',
    text: '排行榜',
    path: '/rankinglist'
  }
]
export default {
  data() {
    return {
      iconBtn: [...iconBtn]
    }
  },
  methods: {
    changeRouter(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/theme/index.scss';

.btn-nav {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  border-bottom: 1px solid $--background-color-base;

  &__item {
    text-align: center;

    .item {
      &__btn {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: $themeColor;
        box-shadow: 0 12px 20px 0 $themeColor;

        .iconfont {
          font-size: 22px;
          color: #fff;
        }
      }
      &__text {
        margin-top: 8px;
        font-size: 13px;
        color: $--color-text-primary;
      }
    }
  }
}
</style>
