import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import api from '@/api'
import 'amfe-flexible'
import VueLazyload from 'vue-lazyload'
import { Toast, Icon, Dialog, Button } from 'vant'

Vue.use(Toast).use(Icon).use(Dialog).use(Button)

Vue.prototype.axios = api
Vue.use(VueLazyload, {
  error:
    '//img-1256555015.file.myqcloud.com/2019/03/05/5c7e6b9e43d27.jpg',
  loading:
    '//img-1256555015.file.myqcloud.com/2019/03/05/5c7e6b9e9befa.gif'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
