import request from '@/util/index.js'// 拿到网络请求方法
import stroe from '@/store' //  引入store对象

export const registerAPI = (obj) => { // 注册接口
  return request({ // 返回promise对象
    url: '/api/reg',
    method: 'POST',
    data: obj
  })
}
export const loginAPI = (obj) => { // 登录接口
  return request({ // 返回promise对象
    url: '/api/login',
    method: 'POST',
    data: obj
  })
}
export const getuserInfoAPI = (params) => { // 获取用户信息
  return request({
    url: '/my/userinfo',
    // 传参给后台：params(查询字符串) data(请求体) headers(请求头)
    headers: {
      Authorization: stroe.state.token
    }
  })
}