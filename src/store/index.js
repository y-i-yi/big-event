import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // vuex-persistedstate为vuex的插件包,让vuex做持久化存储
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 储存登录成功后的token值
    token: ''
  },
  getters: {
  },
  mutations: {
    // 更新token
    updateToken (state, newToken) {
      state.token = newToken
    }
  },
  plugins: [createPersistedState()],
  actions: {
  },
  modules: {
  }
})
