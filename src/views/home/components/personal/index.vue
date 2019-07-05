<template>
  <div class="personal">
    <van-pull-refresh v-model="isRefresh"
      class="scroll-view"
      ref="scrollView"
      @refresh="$_onRefresh">
      <a class="info"
        target="_blank"
        href="https://github.com/Jonathan143/oxygenMusic">
        <div class="name-box">
          <h2 class="name__wrap">
            <span class="name">{{ userInfo.name }}</span>
            <i class="info__level"
              v-show="userInfo.level">Lv.{{userInfo.level}}</i>
          </h2>
          <p class="indicator-text">{{ userInfo.signature }}</p>
        </div>
        <div class="avatar">
          <img class="av-img"
            :src="userInfo.avatarUrl"
            alt="Oxygen Music" />
        </div>
      </a>
      <div class="list-box">
        <div class="list"
          v-for="i in list"
          :key="i.id"
          @click="tolist(i.id)">
          <div class="icon-count">
            <i class="iconfont"
              :class="i.icon"></i>
            <span class="count">{{ i.count }}</span>
          </div>
          <p class="title">{{ i.title }}</p>
        </div>
      </div>

      <div class="sign-out">
        <van-button class="sign-out__btn"
          round
          size="small"
          type="primary"
          @click="signOut">
          {{ signText }}
        </van-button>
      </div>
    </van-pull-refresh>

    <van-dialog :closable="true"
      v-model="isLoginDialogOpen"
      show-cancel-button
      confirm-button-text="登录"
      confirm-button-color="#928ffa"
      :before-close="beforeLoginDialogClose"
      @confirm="onLoginConfirm">
      <van-tabs v-model="loginModeIndex">
        <van-tab title="验证码登录">
          <van-cell-group>
            <van-field v-model="userID"
              ref="login"
              label="手机号"
              type="phone"
              placeholder="请输入手机号"></van-field>
            <van-field v-model="smsCode"
              center
              clearable
              label="短信验证码"
              placeholder="请输入短信验证码">
              <van-button slot="button"
                size="small"
                :disabled="isCaptchSend"
                @click="onCaptchSendClick"
                type="primary">{{isCaptchSend?`${Countdown}s`:'发送验证码'}}</van-button>
            </van-field>
          </van-cell-group>
        </van-tab>
        <van-tab title="账号密码登录">
          <van-cell-group>
            <van-field v-model="userID"
              ref="login"
              label="手机号"
              type="phone"
              placeholder="请输入手机号"></van-field>
            <van-field v-model="password"
              ref="login"
              label="密码"
              type="password"
              placeholder="密码"></van-field>
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </van-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getPersonalList, playListDetail } from '@/utils'
import {
  Dialog,
  PasswordInput,
  NumberKeyboard,
  PullRefresh,
  Tab,
  Tabs,
  Field,
  cellGroup
} from 'vant'

export default {
  components: {
    [Dialog.name]: Dialog,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Field.name]: Field,
    [cellGroup.name]: cellGroup
  },
  data() {
    return {
      timmer: null,
      Countdown: 60,
      isCaptchSend: false,
      CanSendCaptcha: true,
      userID: '',
      password: '',
      smsCode: '',
      loginModeIndex: 0,
      loginModeList: ['verify', 'tel'],
      list: [],
      isLoginDialogOpen: false, // 登录弹窗
      isRefresh: false,
      userInfo: {
        name: `Oxygen Music`,
        signature: `一个基于vue.js音乐播放器`,
        avatarUrl: `https://img-1256555015.file.myqcloud.com/2019/01/25/5c4a704d05904.png`
      }
    }
  },
  computed: {
    ...mapState(['isLogin']),
    signText() {
      return this.isLogin ? '退出登录' : '登录'
    },

    telTxt() {
      const telTxt = String(this.userID)
      return telTxt.substr(0, 3) + '****' + telTxt.substr(7)
    },

    loginMode() {
      return this.loginModeList[this.loginModeIndex]
    }
  },
  watch: {
    isRefresh(value) {
      if (!value) this.$toast.success('刷新数据成功')
    }
  },
  methods: {
    ...mapMutations(['changeUserStatus']),

    tolist(name) {
      this.$router.push({ name: `musiclist`, query: { name: name } })
    },

    beforeLoginDialogClose(action, done) {
      if (action === 'confirm' && !this.userID) {
        done(false)
      } else {
        done()
      }
    },

    onLoginConfirm() {
      const userID = this.userID
      if (userID) {
        if (this.loginMode === 'tel' && this.password) {
          this.loginModeTel()
          this.$toast.loading('登录中...')
        } else if (this.loginMode === 'verify') {
          if (userID.length !== 11) {
            this.$toast.fail('请输入正确的手机号')
            this.userID = ''
            return
          } else {
            this.onCaptchaSubmit()
          }
        } else {
          this.$toast.fail('请输入密码')
        }
      } else {
        this.$toast.fail('请输入手机号')
      }
    },

    onCaptchSendClick() {
      if (this.userID.length === 11) {
        this.isCaptchSend = true
        this.reCaptchSend()

        clearInterval(this.timeer)
        this.timeer = setInterval(() => {
          this.Countdown--
          if (this.Countdown === 0) {
            clearInterval(this.timeer)
            this.Countdown = 60
            this.isCaptchSend = false
          }
        }, 1000)
      } else {
        this.$toast.fail('请输入正确的手机号')
      }
    },

    // 发送验证码
    reCaptchSend() {
      this.axios(`captcha/sent?phone=${this.userID}`).then(() => {
        this.$toast.succeed('验证码发送成功')
      })
    },

    onCaptchaSubmit() {
      this.axios(
        `captcha/verify?phone=${this.userID}&captcha=${this.smsCode}`
      ).then(() => {
        this.$toast.succeed('登录成功')
        this.reUserStatus()
      })
    },

    reUserStatus() {
      this.axios('login/status').then(data => {
        this.userID = data.userId
        this.loginModeUserID()
      })
    },

    getPlaylist() {
      const userID = this.userID || JSON.parse(localStorage.userID)
      this.axios(`/user/playlist?uid=${userID}`).then(res => {
        let list = res.playlist
        let listInfo = {}
        let playlist = []
        for (const item of list) {
          listInfo = {
            id: item.id,
            picUrl: item.coverImgUrl,
            songName: item.name,
            type: 'playlist'
          }
          playlist.push(listInfo)
        }
        // 拉去本地存储 我的收藏 数据合并
        // let myCollection = [];
        // let ls = localStorage.getItem("myCollection");

        // if (ls) {
        //   myCollection = JSON.parse(ls);
        // }
        // myCollection = [...playlist, ...myCollection];
        localStorage.setItem('likeListId', JSON.stringify(playlist[0].id))

        localStorage.setItem('myCollection', JSON.stringify(playlist))
        this.getlikeMusic()
      })
    },
    getlikeMusic() {
      this.axios(
        `/playlist/detail?id=${JSON.parse(localStorage.likeListId)}`
      ).then(res => {
        let likeMusic = playListDetail(res.playlist).tracks
        localStorage.setItem('likeMusic', JSON.stringify(likeMusic))

        this.list = getPersonalList()

        this.isRefresh = false
      })
    },
    loginModeTel() {
      this.axios({
        method: 'post',
        url: `/login/cellphone`,
        params: {
          phone: this.userID,
          password: this.password
        }
      }).then(res => {
        this.password = ''
        this.userID = res.account.id
        this.loginModeUserID()
      })
    },
    loginModeUserID() {
      const userID = this.userID || JSON.parse(localStorage.userID)
      this.axios(`/user/detail?uid=${userID}`)
        .then(res => {
          this.userInfo = {
            id: res.userPoint.userId,
            name: res.profile.nickname,
            signature: res.profile.signature,
            avatarUrl: res.profile.avatarUrl,
            level: res.level
          }
          this.isLoginDialogOpen = false
          if (!localStorage.userInfo) {
            this.changeUserStatus()
          }
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          localStorage.setItem('userID', JSON.stringify(this.userInfo.id))
          this.$toast.clear()
          this.getPlaylist()
        })
        .catch(() => {
          this.$toast.clear()
          setTimeout(() => {
            this.$toast.fail('登录失败')
            this.userID = ''
            this.$refs.login.focus()
          }, 10)
        })
    },
    $_onRefresh() {
      if (localStorage.userInfo) {
        this.loginModeUserID()
      } else {
        this.list = getPersonalList()
        setTimeout(() => {
          this.isRefresh = false
        }, 1000)
      }
    },
    signOut() {
      if (this.isLogin) {
        let removeList = ['userInfo', 'likeMusic', 'myCollection']
        this.removeLS(removeList)

        this.list = getPersonalList()
        this.userInfo = {
          name: `Oxygen Music`,
          signature: `一个基于vue.js音乐播放器`,
          avatarUrl: `https://img-1256555015.file.myqcloud.com/2019/01/25/5c4a704d05904.png`
        }

        this.changeUserStatus()
        this.axios('login/status').then(() => {
          this.$toast.succeed('已退出登录')
        })
      } else {
        this.isLoginDialogOpen = true
      }
    },
    removeLS(removeList) {
      for (const removeItem of removeList) {
        localStorage.removeItem(removeItem)
      }
    }
  },
  mounted() {
    let user = localStorage.userInfo
    if (user) {
      this.userInfo = JSON.parse(user)
      // this.$refs.scrollView.triggerRefresh();
    } else {
      this.isLoginDialogOpen = true
    }
    this.list = getPersonalList()
  },
  activated() {
    this.list = getPersonalList()
  }
}
</script>

<style lang="scss" scoped>
@import '~@/theme/index.scss';

.personal {
  .scroll-view {
    height: 623px;
    padding: 10px;
    box-sizing: border-box;

    .sign-out {
      width: 100px;
      margin: 0 auto;
      &__btn {
        width: 100px;
        height: 36px;
      }
    }
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 10px 10px 0 #eee;
    box-sizing: border-box;
    text-decoration: none;

    &__level {
      display: inline-block;
      font-size: 12px;
      padding: 2px 8px;
      background-color: #e8eaec;
      border-radius: 8px;
      margin-left: 4px;
    }

    .name-box {
      .name {
        font-size: 21px;
        font-weight: 500;
        color: $titleColor;
      }

      .indicator-text {
        color: #71819b;
        // line-height: 32px;
        margin-top: 6px;
        width: 200px;
        @include text-truncate(2);
      }
    }

    .avatar {
      .av-img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
    }
  }

  .list-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 10px;

    .list {
      width: 160px;
      height: 90px;
      background-color: #fff;
      margin: 10px 0;
      padding: 10px 30px;
      border-radius: 8px;
      box-shadow: 0 10px 10px 0 #eee;
      box-sizing: border-box;

      .icon-count {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .iconfont {
          font-size: 24px;
          color: $--color-primary;
        }

        .count {
          font-size: 14px;
          color: $--color-primary;
        }
      }

      .title {
        font-size: 13px;
        margin-top: 6px;
        letter-spacing: 1px;
      }
    }
  }
}
</style>
