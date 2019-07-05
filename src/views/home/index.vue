<template>
  <div class="home">
    <van-tabs v-model="active"
      :line-height="0"
      background="#928ffa"
      title-active-color="#fff"
      title-inactive-color="#E4E7ED"
      swipeable
      sticky
      animated>
      <van-tab v-for="tab in tabList"
        :key="tab.name">
        <div slot="title">
          <i class="iconfont"
            :class="tab.icon"></i>
        </div>
        <!-- <component :is="tab.name"></component> -->
      </van-tab>
    </van-tabs>
    <component :is="componentList[active]"></component>
  </div>
</template>

<script>
import { Tab, Tabs } from 'vant'
import Home from './components/home'
import Find from './components/find'
import Personal from './components/personal'
export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    Home,
    Find,
    Personal
  },
  data() {
    return {
      active: 1,
      tabList: [
        { name: 'personal', icon: 'icon-wo1' },
        { name: 'home', icon: 'icon-yinle' },
        { name: 'find', icon: 'icon-faxian' }
      ],

      componentList: ['personal', 'home', 'find']
    }
  },
  watch: {
    active(value) {
      sessionStorage.homeActiveTab = value
    }
  },
  created() {
    this.active = sessionStorage.homeActiveTab || 1
  }
}
</script>

<style lang="scss" scoped>
.home {
  .iconfont {
    font-size: 22px;
    font-weight: 700;
  }
}
</style>