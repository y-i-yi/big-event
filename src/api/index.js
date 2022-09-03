import request from '@/util/index.js'// 拿到网络请求方法
// import store from '@/store' //  引入store对象

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
export const getuserInfoAPI = () => { // 获取用户信息
  return request({
    url: '/my/userinfo'
    // 传参给后台：params(查询字符串) data(请求体) headers(请求头)
    // headers: {
    //   Authorization: store.state.token     统一在请求拦截器中携带
    // }
  })
}
export const getmenusAPI = () => { // 获取侧边栏数据
  return request({
    url: '/my/menus'
    // headers: {
    //   Authorization: store.state.token
    // }
  })
}

export const updateUserInfoAPI = (obj) => { // 更新用户信息
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: obj
  })
}

export const updateUserAvatar = (avatar) => { // 更新用户头像
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: { avatar }
  })
}

export const updateUserPwdAPI = (obj) => { // 更新用户密码
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: obj
  })
}

export const getArtCateListAPI = () => { // 获取-文章分类
  return request({
    url: '/my/cate/list'
  })
}

export const addArtCateAPI = (obj) => { // 增加文章分类
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: obj
  })
}

export const updateArtCateAPI = (obj) => { // 修改文章分类
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: obj
  })
}

export const delArtCateAPI = (id) => { // 删除文章分类
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

export const uploadArtAPI = (fd) => { // 发布-文章
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd // 后端参数要的fd表单对象
  })
}

export const getArtListAPI = (obj) => {
  return request({
    url: '/my/article/list',
    params: obj
  })
}

export const getArtInfoAPI = (id) => { // 获取-文章详情(id:文章id)
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

export const delArtAPI = (id) => { // 删除-文章
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}