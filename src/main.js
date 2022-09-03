import Vue from 'vue'
import App from '@/App.vue'

import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI'
import less from 'less'

import dayjs from 'dayjs' // 格式化时间第三方包

import VueQuillEditor from 'vue-quill-editor' // 引入vue-quill-editor

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.use(less)
Vue.config.productionTip = false

// 定义时间格式化函数,在vue的原型上添加个属性
Vue.prototype.$formateDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
