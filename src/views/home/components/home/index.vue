<template>
  <div class="home">
    <div class="home__content">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(url,index) in banner"
          :key="index">
          <img class="home__banner"
            v-lazy="url" />
        </van-swipe-item>
      </van-swipe>

      <btn-nav></btn-nav>
      <div class="music-content">
        <scroll-view class="scroll-view"
          title="新歌速递"
          :musicData="newSong"
          circle></scroll-view>
        <scroll-view class="scroll-view"
          title="热门歌单"
          multi
          :hasDetails="true"
          :musicData="hotPlayList"></scroll-view>
        <scroll-view class="scroll-view"
          title="最新歌单"
          multi
          :hasDetails="true"
          :musicData="newPlayList"></scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'vant'
import ScrollView from './components/ScrollView'
import BtnNav from './components/BtnNav'
import { getSongs, getPlayList } from '@/utils'
export default {
  name: 'home',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    ScrollView,
    BtnNav
  },
  data() {
    return {
      current: 'home',
      newSong: [],
      newPlayList: [],
      hotPlayList: [],
      banner: []
    }
  },
  created() {
    this.getBanner()
    this.getNewSong()
    this.getNewPlayList()
    this.getHotPlayList()
    this.reUserState()
  },
  methods: {
    getNewSong() {
      this.axios(`personalized/newsong`).then(res => {
        this.newSong = getSongs(res.result).splice(0, 6)
      })
    },
    getNewPlayList() {
      this.axios(`top/playlist?limit=6&order=new`).then(res => {
        this.newPlayList = getPlayList(res.playlists)
      })
    },
    getHotPlayList() {
      this.axios(`top/playlist?limit=6&order=hot`).then(res => {
        this.hotPlayList = getPlayList(res.playlists)
      })
    },
    getBanner() {
      this.axios(`banner`).then(res => {
        this.banner = res.banners.map(item => item.imageUrl)
      })
    },

    reUserState() {
      this.axios('login/status')
        .then(() => {
          sessionStorage.isLogin = true
        })
        .catch(() => {
          sessionStorage.isLogin = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &__banner {
    width: 100%;
    height: 140px;
  }
}
</style>
