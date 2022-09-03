// 网络请求方法
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
export const baseURL = 'http://big-event-vue-api-t.itheima.net' // 接口和资源的服务器地址

const myAxios = axios.create({
  baseURL: baseURL
})

// 定义请求拦截器 api里每次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(function (config) {
  // 请求前会触发一次
  // 它返回给axios内的源码，config配置对象（要请求后台的参数都在这个对象上）

  // 发起时携带一个请求头 token值存在时才携带
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 请求发起前的代码 如果有异常报错，会直接进入这里 会返回一个拒绝状态的promise对象
  // Promise.reject()原地留下promise对象 状态为失败
  return Promise.reject(error)
})

// 定义响应拦截器
myAxios.interceptors.response.use(function (response) {
  // 响应HTTP状态码为2xx或3xx时触发成功的回调,response是成功的结果
  return response
}, function (error) {
  // 响应HTTP状态码为4xx或5xx时触发失败的回调
  // console.dir(error)
  if (error.response.status === 401) {
    // token过期了
    // 清除vuex中的一切，切回登录页
    store.commit('updateToken', '')
    store.commit('updateuserInfo', {})
    router.push('/login')
    Message.error('用户身份已过期') // 出现弹窗
  }
  return Promise.reject(error)
})

export default myAxios