// 网络请求方法
import axios from 'axios'
const request = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})
export default request