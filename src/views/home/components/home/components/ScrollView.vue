<template>
  <div class="card">
    <div class="top-container">
      <span class="title"
        @click="loadMore">{{ title }}</span>
      <van-icon name="arrow"
        class="card__icon"
        @click="loadMore"></van-icon>
    </div>
    <div class="card__list">
      <div class="card__item"
        v-for="song in musicData"
        :key="song.id"
        @click="playMusic(song)">
        <div class="item__img-wrap">
          <img class="item__bg"
            v-lazy="song.picUrl"
            alt=""
            :class="{ circle }" />
          <img class="item__img"
            v-lazy="song.picUrl"
            alt=""
            :class="{ circle }" />
        </div>
        <p class="item__title"
          :class="[multi ? 'multi-ellipsis' : 'ellipsis']">
          {{ song.songName }}
        </p>
        <p class="item__sub-title">{{ song.singer }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { setMusic, lisenMusicAdd } from '@/utils'
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    musicData: {
      type: Array,
      required: true
    },
    multi: {
      type: Boolean,
      default: false
    },
    hasDetails: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapMutations(['ADD_MUSIC']),
    playMusic(song) {
      if (this.hasDetails) {
        this.$router.push({
          path: '/playlistdetail',
          query: { id: song.id, title: song.songName }
        })
      } else {
        let playList = setMusic(song)
        this.ADD_MUSIC(playList)
        lisenMusicAdd(song)
      }
    },
    loadMore() {
      this.$router.push({ path: '/moremusic', query: { title: this.title } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/theme/index.scss';

.card {
  width: 100%;
  padding: 10px;
  background: #fff;
  box-sizing: border-box;

  .top-container {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 14px;
      font-weight: 500;
      padding: 10px 0;
      color: $--color-text-primary;
    }
  }
  &__icon {
    padding: 10px 0;
    font-size: 14px;
    color: $--color-text-primary;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__item {
    margin-top: 10px;
    font-size: 12px;

    .item {
      &__img {
        width: 90px;
        height: 90px;
        border-radius: 4px;
        @include bg-filter;
        &-wrap {
          position: relative;
          width: 90px;
          height: 90px;
        }
      }
      &__bg {
        @include f-filter;
      }
      &__title {
        width: 90px;
        margin-top: 8px;
        line-height: 22px;
        text-align: center;
        color: $--color-text-primary;
      }

      &__sub-title {
        @include text-truncate;
        width: 90px;
        font-size: 12px;
        color: $--color-text-secondary;
        text-align: center;
      }
    }
  }
}

.multi-ellipsis {
  @include text-truncate(2);
}

.ellipsis {
  @include text-truncate;
}

.circle {
  border-radius: 50% !important;
}
</style>
