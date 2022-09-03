import { getuserInfoAPI } from '@/api'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // vuex-persistedstate为vuex的插件包,让vuex做持久化存储
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 储存登录成功后的token值
    token: '',
    userInfo: {} // 保存用户信息 id，username，nickname，email，user_pic
  },
  getters: {
    // nickname (state) {
    //   return state.userInfo.nickname
    // }  也可以这样写
    nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 名字
    user_pic: state => state.userInfo.user_pic// 头像地址
  },
  mutations: { // state的值通过mutations函数赋值
    // 更新token
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 保存用户信息
    updateuserInfo (state, newuserInfo) {
      state.userInfo = newuserInfo
    }
  },
  plugins: [createPersistedState()],
  actions: {
    // 更新用户信息
    async getuserInfo (context) {
      const { data: res } = await getuserInfoAPI() // 重新请求用户信息
      // console.log(res)
      context.commit('updateuserInfo', res.data) // 将新的信息进行保存
    }
  },
  modules: {
  }
})
