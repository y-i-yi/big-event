import Vue from 'vue'
import VueRouter from 'vue-router'
// import Register from '@/views/register'
// import Login from '@/views/login'
// import Layout from '@/views/layout'
import store from '@/store'
// import Home from '@/views/Home'

Vue.use(VueRouter)
const routes = [
  // { path: '/', redirect: '/login' }, // 默认去登录页
  {
    path: '/register',
    component: () => import('@/views/register') // webpack提供import 函数来路由懒加载，路径切换时才去加载对应的组件
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [{ path: 'home', component: () => import('@/views/Home') },
      { path: 'user-info', component: () => import('@/views/User/userInfo.vue') },
      { path: 'user-avatar', component: () => import('@/views/User/userAvatar.vue') },
      { path: 'user-pwd', component: () => import('@/views/User/userPwd.vue') },
      { path: 'art-cate', component: () => import('@/views/Art/artCate.vue') },
      { path: 'art-list', component: () => import('@/views/Art/artList.vue') }
    ]
  } // 默认打开去布局页
]
const router = new VueRouter({
  routes
})
const whiteList = ['/login', '/register'] // 白名单 无需登录就可访问

// 全局前置路由守卫
// 浏览器第一次打开项目页面，会触发一次全局前置路由守卫函数
router.beforeEach((to, from, next) => {
  const token = store.state.token // 本地有token值才去请求用户信息
  if (token) {
    // 登录了
    if (!store.state.userInfo.username) {
      store.dispatch('getuserInfo')
    }
    next()
  } else {
    // 未登录
    // 数组.includes(值) 判断值是否在数组中出现，如果出现返回true
    if (whiteList.includes(to.path)) {
      // 未登录又可访问的路由地址放行(路由守卫不会再触发了而会匹配路由表让组件挂载)
      next()
    } else {
      // 强制跳转登录页
      next('/login')
    }
  }
})
export default router
